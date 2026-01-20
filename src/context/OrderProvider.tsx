'use client';

import { createContext, ReactNode, useMemo } from 'react';
import { collection, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { useAdmin } from '@/hooks/use-admin';
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
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  const queryRef = useMemoFirebase(() => {
    if (!firestore || isAuthLoading || isAdminLoading || !user) return null;

    // Admins get all orders
    if (isAdmin) {
      return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
    }

    // Regular user gets only their orders
    return query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user, isAdmin, isAuthLoading, isAdminLoading]);

  const { data: rawOrders, isLoading: isOrdersLoading } =
    useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(queryRef);

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map(o => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);

  // The overall loading state is true if we are waiting for auth, admin check, or the orders themselves.
  const isLoading = isAuthLoading || isAdminLoading || isOrdersLoading;

  return (
    <OrderContext.Provider value={{ orders, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};
