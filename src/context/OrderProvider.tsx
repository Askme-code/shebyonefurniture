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
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  // ⛔ HARD STOP: do nothing until auth + admin state resolved
  const canQuery = !!firestore && !isAuthLoading && !isAdminLoading;

  const queryRef = useMemoFirebase(() => {
    if (!canQuery) return null;

    if (isAdmin) {
      return query(
        collection(firestore, 'orders'),
        orderBy('createdAt', 'desc')
      );
    }
    
    if (user) {
        return query(
          collection(firestore, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
    }

    return null; // Return null if not admin and no user (e.g., logged out)
  }, [canQuery, isAdmin, firestore, user]);

  const { data: rawOrders, isLoading: isOrdersLoading } =
    useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(
      queryRef
    );

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map((o) => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);

  const isLoading = isAuthLoading || isAdminLoading || isOrdersLoading;

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
