'use client';
import { createContext, ReactNode, useCallback, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { 
    useFirestore, 
    useCollection,
    useMemoFirebase,
    addDocumentNonBlocking,
    updateDocumentNonBlocking,
    deleteDocumentNonBlocking
} from '@/firebase';
import { collection, doc, serverTimestamp, Timestamp } from 'firebase/firestore';

// Define the shape of the context
export const ProductContext = createContext<{
  products: Product[];
  isLoading: boolean;
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}>({
  products: [],
  isLoading: true,
  getProductById: () => undefined,
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
});

// The provider component
export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const firestore = useFirestore();

  // Memoize the collection reference
  const productsCollectionRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  
  // Subscribe to the collection
  const { data: rawProducts, isLoading } = useCollection<Omit<Product, 'createdAt'> & { createdAt: Timestamp }>(productsCollectionRef);

  // Memoize and process products: convert Timestamps to Dates
  const products = useMemo(() => {
    if (!rawProducts) return [];
    return rawProducts.map(p => ({
      ...p,
      createdAt: p.createdAt ? p.createdAt.toDate() : new Date(),
    }));
  }, [rawProducts]);
  

  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);


  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!firestore) return;

    const productsCollection = collection(firestore, 'products');
    const newProduct = {
        ...productData,
        createdAt: serverTimestamp(),
    };
    
    addDocumentNonBlocking(productsCollection, newProduct);
  }, [firestore]);


  const updateProduct = useCallback((product: Product) => {
    if (!firestore) return;
    const productDocRef = doc(firestore, 'products', product.id);
    
    // The `updateDocumentNonBlocking` needs a plain object.
    const productToUpdate = {
        ...product,
        createdAt: product.createdAt, // Should already be a Date object from the `products` memo
    };
    
    updateDocumentNonBlocking(productDocRef, productToUpdate);
  }, [firestore]);


  const deleteProduct = useCallback((productId: string) => {
    if (!firestore) return;
    const productDocRef = doc(firestore, 'products', productId);
    deleteDocumentNonBlocking(productDocRef);
  }, [firestore]);


  const contextValue = useMemo(() => ({
    products,
    isLoading,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  }), [products, isLoading, getProductById, addProduct, updateProduct, deleteProduct]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};
