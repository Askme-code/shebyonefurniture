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
    // Wait until all auth/admin checks are done and we have a user.
    if (isAuthLoading || isAdminLoading || !user || !firestore) {
      return null;
    }

    // For admins, query the entire collection.
    if (isAdmin) {
      return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
    }

    // For regular users, build a query filtered by their user ID.
    return query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user, isAdmin, isAuthLoading, isAdminLoading]);

  // The useCollection hook will safely handle the null initial state of queryRef.
  const { data: rawOrders, isLoading: isOrdersLoading } =
    useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(queryRef);

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map(o => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);
  
  // The overall loading state is true until all checks and the data fetch are complete.
  const isLoading = isAuthLoading || isAdminLoading || isOrdersLoading;

  return (
    <OrderContext.Provider value={{ orders, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};
