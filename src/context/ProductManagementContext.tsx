import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import { productsData } from '../data/products';
import { useUI } from './UIContext';

interface ProductManagementContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'numericId'>) => Product;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  resetToDefault: () => void;
  getProductById: (id: string) => Product | undefined;
}

const STORAGE_KEY = 'casacas_lb_managed_products';

const ProductManagementContext = createContext<ProductManagementContextType | undefined>(undefined);

const cleanForFirestore = <T,>(data: T): T => {
  return JSON.parse(
    JSON.stringify(data, (_, value) => (value === undefined ? null : value))
  );
};

const safeSaveLocal = (items: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanForFirestore(items)));
  } catch (storageErr) {
    console.warn('localStorage quota warning, using compact fallback:', storageErr);
    try {
      const compact = items.map((p) => ({
        ...p,
        images: p.images.map((img) => (img.startsWith('data:image') && img.length > 500 ? '' : img))
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
    } catch {
      // Ignore if storage is completely filled
    }
  }
};

export const ProductManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useUI();
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading products from storage:', e);
    }
    return productsData;
  });

  // Sync with Firestore in real-time using the 'products' collection
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    const prodsCol = collection(db, 'products');

    const initCatalog = async () => {
      try {
        const prodsSnap = await getDocs(prodsCol);
        if (prodsSnap.empty) {
          // If collection 'products' is empty, check legacy 'catalog/products' or use seed data
          let initialItems: Product[] = productsData;
          try {
            const legacyDoc = await getDoc(doc(db, 'catalog', 'products'));
            if (legacyDoc.exists() && Array.isArray(legacyDoc.data()?.items) && legacyDoc.data()?.items.length > 0) {
              initialItems = legacyDoc.data()?.items;
            }
          } catch (e) {
            console.warn('Legacy catalog doc check:', e);
          }

          // Populate 'products' collection with initial items
          const batch = writeBatch(db);
          for (const item of initialItems) {
            const itemRef = doc(db, 'products', item.id);
            batch.set(itemRef, cleanForFirestore(item));
          }
          await batch.commit();
        }
      } catch (err) {
        console.warn('Products collection initialization notice:', err);
      }

      // Real-time listener on products collection
      unsubscribe = onSnapshot(
        prodsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const loaded = snapshot.docs.map((d) => d.data() as Product);
            // Sort by numericId descending (newer products first)
            loaded.sort((a, b) => (b.numericId || 0) - (a.numericId || 0));
            setProducts(loaded);
            safeSaveLocal(loaded);
          }
        },
        (error) => {
          console.warn('Firestore products collection listener error:', error);
        }
      );
    };

    initCatalog();

    return () => unsubscribe();
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'numericId'>): Product => {
    const nextNumericId = products.length > 0
      ? Math.max(...products.map((p) => p.numericId || 0)) + 1
      : 1;

    const newProduct: Product = {
      ...productData,
      id: `prod-custom-${Date.now()}`,
      numericId: nextNumericId,
      stock: Math.max(0, productData.stock ?? 10)
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    safeSaveLocal(updated);

    // Save to Firestore collection as its own document (no 1MB single-document limit)
    setDoc(doc(db, 'products', newProduct.id), cleanForFirestore(newProduct))
      .then(() => {
        showToast(`Producto "${newProduct.name}" guardado en la nube con éxito.`, 'success');
      })
      .catch((err: any) => {
        console.error('Error guardando en Firestore:', err);
        showToast(`Error al sincronizar con la nube: ${err.message || 'Verifique su conexión'}`, 'error');
      });

    return newProduct;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    let updatedItem: Product | undefined;
    const updated = products.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          ...updatedFields,
          stock: updatedFields.stock !== undefined ? Math.max(0, updatedFields.stock) : item.stock
        };
        return updatedItem;
      }
      return item;
    });

    setProducts(updated);
    safeSaveLocal(updated);

    if (updatedItem) {
      setDoc(doc(db, 'products', id), cleanForFirestore(updatedItem), { merge: true })
        .then(() => {
          showToast('Producto actualizado en la nube correctamente.', 'success');
        })
        .catch((err: any) => {
          console.error('Error actualizando en Firestore:', err);
          showToast(`Error al actualizar en la nube: ${err.message || 'Verifique su conexión'}`, 'error');
        });
    }
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    safeSaveLocal(updated);

    deleteDoc(doc(db, 'products', id))
      .then(() => {
        showToast(`Producto "${target?.name || id}" eliminado del catálogo.`, 'info');
      })
      .catch((err: any) => {
        console.error('Error eliminando en Firestore:', err);
        showToast(`Error al eliminar de la nube: ${err.message || 'Verifique su conexión'}`, 'error');
      });
  };

  const updateStock = (id: string, newStock: number) => {
    const normalizedStock = Math.max(0, newStock);
    const updated = products.map((item) => {
      if (item.id === id) {
        return { ...item, stock: normalizedStock };
      }
      return item;
    });
    setProducts(updated);
    safeSaveLocal(updated);

    setDoc(doc(db, 'products', id), { stock: normalizedStock }, { merge: true }).catch((err) => {
      console.error('Error actualizando stock en Firestore:', err);
    });
  };

  const resetToDefault = () => {
    setProducts(productsData);
    safeSaveLocal(productsData);

    const batch = writeBatch(db);
    for (const item of productsData) {
      batch.set(doc(db, 'products', item.id), cleanForFirestore(item));
    }
    batch.commit()
      .then(() => {
        showToast('Catálogo restablecido a los valores oficiales en la nube.', 'info');
      })
      .catch((err: any) => {
        console.error('Error restableciendo catálogo en Firestore:', err);
        showToast(`Error al restablecer catálogo: ${err.message || 'Error de conexión'}`, 'error');
      });
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <ProductManagementContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        resetToDefault,
        getProductById
      }}
    >
      {children}
    </ProductManagementContext.Provider>
  );
};

export const useProductManagement = () => {
  const context = useContext(ProductManagementContext);
  if (!context) {
    throw new Error('useProductManagement must be used within a ProductManagementProvider');
  }
  return context;
};

