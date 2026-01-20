'use client';
import { createContext, ReactNode, useMemo } from 'react';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Order } from '@/lib/types';
import { useAdmin } from '@/hooks/use-admin';

type OrderWithDate = Omit<Order, 'createdAt'> & { createdAt: Date };

export const OrderContext = createContext<{
  orders: OrderWithDate[];
  isLoading: boolean;
}>({
  orders: [],
  isLoading: true,
});

/**
 * An internal component that fetches all orders.
 * It should ONLY be rendered after confirming the user is an admin.
 */
function AdminOrderFetcher({ children }: { children: ReactNode }) {
    const firestore = useFirestore();
    
    // This query fetches all documents from the 'orders' collection.
    const ordersQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'orders'), orderBy('createdAt', 'desc')) : null,
        [firestore]
    );

    const { data: rawOrders, isLoading } = useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(ordersQuery);

    const orders = useMemo(() => {
        if (!rawOrders) return [];
        return rawOrders.map(o => ({
            ...o,
            createdAt: o.createdAt?.toDate() ?? new Date(),
        }));
    }, [rawOrders]);

    const contextValue = useMemo(() => ({
        orders,
        isLoading,
    }), [orders, isLoading]);

    return (
        <OrderContext.Provider value={contextValue}>
            {children}
        </OrderContext.Provider>
    );
}

/**
 * This provider now acts as a guard. It will only render the full data-fetching
 * component (`AdminOrderFetcher`) if it confirms the user has admin privileges.
 * Otherwise, it provides a safe, empty, non-loading state.
 */
export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  // While we're checking for admin status, provide a loading state
  // and prevent any data fetching attempts.
  if (isAdminLoading) {
    return (
        <OrderContext.Provider value={{ orders: [], isLoading: true }}>
            {children}
        </OrderContext.Provider>
    );
  }
  
  // If the user is definitively not an admin, provide an empty, non-loading state.
  // This prevents any downstream components from trying to use admin-only data.
  if (!isAdmin) {
    return (
        <OrderContext.Provider value={{ orders: [], isLoading: false }}>
            {children}
        </OrderContext.Provider>
    );
  }

  // If we've passed the guards, the user is a confirmed admin, and it's safe
  // to render the component that will fetch all orders.
  return <AdminOrderFetcher>{children}</AdminOrderFetcher>;
};
