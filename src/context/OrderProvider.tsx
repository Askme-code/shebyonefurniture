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

  const ordersQuery = useMemoFirebase(
    () => (firestore ? query(collectionGroup(firestore, 'orders'), orderBy('createdAt', 'desc')) : null),
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
};
