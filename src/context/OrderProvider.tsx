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
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const firestore = useFirestore();

  // Conditionally build the query. It will be null if the user is not an admin
  // or if Firestore is not yet available. This is the core of the fix.
  const adminOrdersQuery = useMemoFirebase(
    () =>
      isAdmin && firestore
        ? query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'))
        : null,
    [isAdmin, firestore]
  );

  // The useCollection hook safely handles a null query by not fetching data.
  const { data: rawOrders, isLoading: isOrdersLoading } = useCollection<
    Omit<Order, 'createdAt'> & { createdAt: Timestamp }
  >(adminOrdersQuery);

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map((o) => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);

  // The overall loading state is true if we're checking for admin status,
  // or if we are an admin and the orders are still loading.
  const isLoading = isAdminLoading || (isAdmin && isOrdersLoading);

  const contextValue = useMemo(
    () => ({
      // Only provide the orders list if the user is a confirmed admin.
      orders: isAdmin ? orders : [],
      isLoading: isLoading,
    }),
    [orders, isLoading, isAdmin]
  );

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};
