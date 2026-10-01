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
import { db, IS_SANDBOX_ISOLATED } from '../config/firebase';
import { Product } from '../types';
import { productsData } from '../data/products';
import { useUI } from './UIContext';

import { idbGet, idbSet } from '../utils/idbStorage';

interface ProductManagementContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'numericId'>) => Product;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  moveProductOrder: (productId: string, direction: 'up' | 'down' | 'top') => void;
  reorderProducts: (orderedIds: string[]) => Promise<void>;
  resetToDefault: () => void;
  restoreBackupProducts: (backupItems: Product[]) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

const STORAGE_KEY = 'casacas_lb_experimental_products';

const ProductManagementContext = createContext<ProductManagementContextType | undefined>(undefined);

const cleanForFirestore = <T,>(data: T): T => {
  return JSON.parse(
    JSON.stringify(data, (_, value) => (value === undefined ? null : value))
  );
};

const safeSaveLocal = (items: Product[]) => {
  // 1. Guardar completo con todas las fotos en IndexedDB (cientos de megabytes en disco del navegador)
  idbSet(STORAGE_KEY, cleanForFirestore(items));

  // 2. Guardar versión compacta en localStorage sin cadenas Base64 pesadas para no colapsar el límite de 5 MB
  try {
    const compact = items.map((p) => ({
      ...p,
      images: p.images.map((img) => (img.startsWith('data:image') && img.length > 500 ? '' : img))
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
  } catch {
    // Ignore si localStorage está saturado por otros datos
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

  // Carga inicial profunda desde IndexedDB (recupera fotos completas locales sin límite de 5 MB)
  useEffect(() => {
    idbGet<Product[]>(STORAGE_KEY).then((cached) => {
      if (Array.isArray(cached) && cached.length > 0) {
        setProducts(cached);
      }
    });
  }, []);

  // Sync with Firestore in real-time using the 'products' collection (Omitido en modo sandbox aislado)
  useEffect(() => {
    if (IS_SANDBOX_ISOLATED) {
      return;
    }
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
            // Sort by displayOrder ascending if defined, else fallback to numericId descending
            loaded.sort((a, b) => {
              if (a.displayOrder != null && b.displayOrder != null) {
                return a.displayOrder - b.displayOrder;
              }
              if (a.displayOrder != null) return -1;
              if (b.displayOrder != null) return 1;
              return (b.numericId || 0) - (a.numericId || 0);
            });
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
      displayOrder: 1,
      stock: Math.max(0, productData.stock ?? 10)
    };

    // Place at beginning of feed and bump displayOrder of other products
    const updated = [
      newProduct,
      ...products.map((p, idx) => ({ ...p, displayOrder: idx + 2 }))
    ];
    setProducts(updated);
    safeSaveLocal(updated);

    if (!IS_SANDBOX_ISOLATED) {
      // Save to Firestore collection as its own document (no 1MB single-document limit)
      setDoc(doc(db, 'products', newProduct.id), cleanForFirestore(newProduct))
        .then(() => {
          showToast(`Producto "${newProduct.name}" guardado en la nube con éxito.`, 'success');
        })
        .catch((err: any) => {
          console.error('Error guardando en Firestore:', err);
          showToast(`Error al sincronizar con la nube: ${err.message || 'Verifique su conexión'}`, 'error');
        });
    } else {
      showToast(`[Experimental] Producto "${newProduct.name}" creado localmente.`, 'success');
    }

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
      if (!IS_SANDBOX_ISOLATED) {
        setDoc(doc(db, 'products', id), cleanForFirestore(updatedItem), { merge: true })
          .then(() => {
            showToast('Producto actualizado en la nube correctamente.', 'success');
          })
          .catch((err: any) => {
            console.error('Error actualizando en Firestore:', err);
            showToast(`Error al actualizar en la nube: ${err.message || 'Verifique su conexión'}`, 'error');
          });
      } else {
        showToast('[Experimental] Producto actualizado localmente.', 'success');
      }
    }
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    safeSaveLocal(updated);

    if (!IS_SANDBOX_ISOLATED) {
      deleteDoc(doc(db, 'products', id))
        .then(() => {
          showToast(`Producto "${target?.name || id}" eliminado del catálogo.`, 'info');
        })
        .catch((err: any) => {
          console.error('Error eliminando en Firestore:', err);
          showToast(`Error al eliminar de la nube: ${err.message || 'Verifique su conexión'}`, 'error');
        });
    } else {
      showToast(`[Experimental] Producto "${target?.name || id}" eliminado localmente.`, 'info');
    }
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

    if (!IS_SANDBOX_ISOLATED) {
      setDoc(doc(db, 'products', id), { stock: normalizedStock }, { merge: true }).catch((err) => {
        console.error('Error actualizando stock en Firestore:', err);
      });
    }
  };

  const moveProductOrder = (productId: string, direction: 'up' | 'down' | 'top') => {
    const currentIndex = products.findIndex((p) => p.id === productId);
    if (currentIndex === -1) return;

    const newProducts = [...products];

    if (direction === 'top') {
      if (currentIndex === 0) return;
      const [item] = newProducts.splice(currentIndex, 1);
      newProducts.unshift(item);
    } else if (direction === 'up') {
      if (currentIndex === 0) return;
      const temp = newProducts[currentIndex - 1];
      newProducts[currentIndex - 1] = newProducts[currentIndex];
      newProducts[currentIndex] = temp;
    } else if (direction === 'down') {
      if (currentIndex === newProducts.length - 1) return;
      const temp = newProducts[currentIndex + 1];
      newProducts[currentIndex + 1] = newProducts[currentIndex];
      newProducts[currentIndex] = temp;
    }

    // Reassign sequential displayOrder: 1, 2, 3...
    const updatedWithOrder = newProducts.map((p, idx) => ({
      ...p,
      displayOrder: idx + 1
    }));

    setProducts(updatedWithOrder);
    safeSaveLocal(updatedWithOrder);

    const targetProduct = newProducts.find((p) => p.id === productId);
    const newRank = updatedWithOrder.findIndex((p) => p.id === productId) + 1;

    if (!IS_SANDBOX_ISOLATED) {
      // Batch update order in Firestore
      const batch = writeBatch(db);
      updatedWithOrder.forEach((p) => {
        batch.update(doc(db, 'products', p.id), { displayOrder: p.displayOrder });
      });

      batch.commit()
        .then(() => {
          showToast(`"${targetProduct?.name || 'Producto'}" ahora es el #${newRank} en el feed.`, 'success');
        })
        .catch((err) => {
          console.error('Error al actualizar orden en Firestore:', err);
          showToast('Error al actualizar orden en la nube.', 'error');
        });
    } else {
      showToast(`[Experimental] "${targetProduct?.name || 'Producto'}" ahora es el #${newRank}.`, 'success');
    }
  };

  const reorderProducts = async (orderedIds: string[]): Promise<void> => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    const orderedList: Product[] = [];

    orderedIds.forEach((id, idx) => {
      const item = productMap.get(id);
      if (item) {
        orderedList.push({
          ...item,
          displayOrder: idx + 1
        });
        productMap.delete(id);
      }
    });

    // Add any remaining items
    productMap.forEach((item) => {
      orderedList.push({
        ...item,
        displayOrder: orderedList.length + 1
      });
    });

    setProducts(orderedList);
    safeSaveLocal(orderedList);

    if (!IS_SANDBOX_ISOLATED) {
      try {
        const batch = writeBatch(db);
        orderedList.forEach((p) => {
          batch.update(doc(db, 'products', p.id), { displayOrder: p.displayOrder });
        });
        await batch.commit();
        showToast('Nuevo orden del feed guardado exitosamente.', 'success');
      } catch (err: any) {
        console.error('Error guardando reordenamiento:', err);
        showToast(`Error al guardar orden: ${err.message || 'Error de conexión'}`, 'error');
      }
    } else {
      showToast('[Experimental] Nuevo orden guardado localmente.', 'success');
    }
  };

  const resetToDefault = () => {
    // Desactivado permanentemente para proteger el catálogo real del usuario
    console.warn('El restablecimiento de fábrica ha sido desactivado para proteger tus productos.');
  };

  const restoreBackupProducts = async (backupItems: Product[]): Promise<void> => {
    setProducts(backupItems);
    safeSaveLocal(backupItems);

    if (!IS_SANDBOX_ISOLATED) {
      try {
        const batch = writeBatch(db);
        for (const item of backupItems) {
          batch.set(doc(db, 'products', item.id), cleanForFirestore(item));
        }
        await batch.commit();
        showToast(`Copia de seguridad restaurada (${backupItems.length} productos sincronizados con Firebase).`, 'success');
      } catch (err: any) {
        console.error('Error restaurando backup en Firestore:', err);
        showToast(`Error al sincronizar con Firebase: ${err.message || 'Error de conexión'}`, 'error');
        throw err;
      }
    } else {
      showToast(`Copia de seguridad restaurada localmente (${backupItems.length} productos).`, 'success');
    }
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
        moveProductOrder,
        reorderProducts,
        resetToDefault,
        restoreBackupProducts,
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

