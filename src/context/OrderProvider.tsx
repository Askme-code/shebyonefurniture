'use client';
import { createContext, ReactNode, useMemo } from 'react';
import { collectionGroup, query, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Order } from '@/lib/types';

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

  // Since AdminLayout already verifies the user is an admin before rendering this provider,
  // we can simplify the logic and directly create the query.
  const ordersQuery = useMemoFirebase(
    () => (firestore ? query(collectionGroup(firestore, 'orders'), orderBy('createdAt', 'desc')) : null),
    [firestore]
  );

  const { data: rawOrders, isLoading: areOrdersLoading } = useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(ordersQuery);

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map(o => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);
  
  const isLoading = areOrdersLoading;

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
