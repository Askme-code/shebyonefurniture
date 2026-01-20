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

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const firestore = useFirestore();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  // Only run the query if the user is a confirmed admin and the check is complete.
  // This provider is only used within the AdminLayout, which should already
  // protect it, but this serves as a critical secondary guard against race conditions.
  const ordersQuery = useMemoFirebase(
    () => {
      if (firestore && !isAdminLoading && isAdmin) {
        return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
      }
      return null; // If not an admin or still loading, the query is null.
    },
    [firestore, isAdmin, isAdminLoading]
  );

  const { data: rawOrders, isLoading: areOrdersLoading } = useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(ordersQuery);

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map(o => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);
  
  // The overall loading state is a combination of the admin check and the data fetching.
  const isLoading = isAdminLoading || areOrdersLoading;

  const contextValue = useMemo(() => ({
    orders,
    isLoading,
  }), [orders, isLoading]);

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};
