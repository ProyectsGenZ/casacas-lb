import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
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

  // Sync with Firestore in real-time
  useEffect(() => {
    const docRef = doc(db, 'catalog', 'products');

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.items) && data.items.length > 0) {
            setProducts(data.items);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.items));
            } catch {
              // ignore
            }
          }
        } else {
          // Initialize in Firestore with seed data
          setDoc(docRef, { items: productsData }).catch((err) => {
            console.error('Error seeding products in Firestore:', err);
          });
        }
      },
      (error) => {
        console.warn('Firestore catalog sync notice:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveProductsToCloud = async (newProducts: Product[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
      const docRef = doc(db, 'catalog', 'products');
      await setDoc(docRef, { items: newProducts });
    } catch (err) {
      console.error('Error updating products in Firestore:', err);
    }
  };

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
    saveProductsToCloud(updated);
    showToast(`Producto "${newProduct.name}" creado con éxito.`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...updatedFields,
          stock: updatedFields.stock !== undefined ? Math.max(0, updatedFields.stock) : item.stock
        };
      }
      return item;
    });

    setProducts(updated);
    saveProductsToCloud(updated);
    showToast('Producto actualizado correctamente.', 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    saveProductsToCloud(updated);
    showToast(`Producto "${target?.name || id}" eliminado del catálogo.`, 'info');
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
    saveProductsToCloud(updated);
  };

  const resetToDefault = () => {
    setProducts(productsData);
    saveProductsToCloud(productsData);
    showToast('Catálogo restablecido a los valores originales oficiales.', 'info');
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
