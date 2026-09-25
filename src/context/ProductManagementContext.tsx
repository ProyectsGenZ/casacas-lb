import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Save to localStorage whenever products change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to storage:', e);
    }
  }, [products]);

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

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Producto "${newProduct.name}" creado con éxito.`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updatedFields,
            stock: updatedFields.stock !== undefined ? Math.max(0, updatedFields.stock) : item.stock
          };
        }
        return item;
      })
    );
    showToast('Producto actualizado correctamente.', 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
    showToast(`Producto "${target?.name || id}" eliminado del catálogo.`, 'info');
  };

  const updateStock = (id: string, newStock: number) => {
    const normalizedStock = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, stock: normalizedStock };
        }
        return item;
      })
    );
  };

  const resetToDefault = () => {
    setProducts(productsData);
    localStorage.removeItem(STORAGE_KEY);
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
