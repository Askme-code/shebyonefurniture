'use client';
import { createContext, useReducer, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { products as initialProducts } from '@/lib/data';

type ProductState = {
  products: Product[];
};

type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: { productId: string } };

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
        return { products: action.payload };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products],
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload.productId),
      };
    default:
      return state;
  }
};

const initialState: ProductState = {
  products: initialProducts,
};

export const ProductContext = createContext<{
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'images'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}>({
  products: initialState.products,
  getProductById: () => undefined,
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const getProductById = useCallback((id: string) => {
    return state.products.find(p => p.id === id);
  }, [state.products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'images'>) => {
    const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date(),
        images: [{ url: 'https://placehold.co/800x600', hint: 'placeholder' }],
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };

  const updateProduct = (product: Product) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
  };

  const deleteProduct = (productId: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: { productId } });
  };

  return (
    <ProductContext.Provider value={{ products: state.products, getProductById, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
