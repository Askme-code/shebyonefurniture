'use client';

import { createContext, ReactNode, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  useUser,
} from '@/firebase';
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
    if (isAuthLoading || isAdminLoading || !firestore) return null;

    if (isAdmin && user) {
      return query(
        collection(firestore, 'orders'),
        orderBy('createdAt', 'desc')
      );
    } else if (user) {
      return query(
        collection(firestore, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
    }

    return null;
  }, [user, isAdmin, isAuthLoading, isAdminLoading, firestore]);

  // 🔐 Only call useCollection if queryRef exists
  let rawOrders: (Omit<Order, 'createdAt'> & { createdAt: Timestamp })[] | null =
    null;
  let isOrdersLoading = true;

  if (queryRef) {
    const result = useCollection<
      Omit<Order, 'createdAt'> & { createdAt: Timestamp }
    >(queryRef);
    rawOrders = result.data;
    isOrdersLoading = result.isLoading;
  }

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map((o) => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);

  const isLoading = isAuthLoading || isAdminLoading || isOrdersLoading;

  return (
    <OrderContext.Provider value={{ orders, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};
