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

  // If this provider is rendered, we can assume the user is an admin
  // because the AdminLayout component is responsible for the authorization check.
  // As a secondary guard, we only run the query if admin status is confirmed.
  const ordersQuery = useMemoFirebase(
    () => {
      if (firestore && isAdmin) {
        return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
      }
      return null;
    },
    [firestore, isAdmin]
  );

  const { data: rawOrders, isLoading: areOrdersLoading } = useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(ordersQuery);

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map(o => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);
  
  // The overall loading state is a combination of admin check and order fetching.
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
