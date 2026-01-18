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

  // Query only if user is a confirmed admin.
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
  
  // Overall loading is true if we're checking admin status OR fetching orders.
  const isLoading = isAdminLoading || (isAdmin && areOrdersLoading);

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
