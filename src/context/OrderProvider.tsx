'use client';

import { createContext, ReactNode, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';

import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
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

  // 🔐 ADMIN QUERY (all orders)
  const adminOrdersQuery = useMemoFirebase(
    () =>
      isAdmin && firestore
        ? query(
            collection(firestore, 'orders'),
            orderBy('createdAt', 'desc')
          )
        : null,
    [isAdmin, firestore]
  );

  // 👤 USER QUERY (only their orders)
  const userOrdersQuery = useMemoFirebase(
    () =>
      !isAdmin && user && firestore
        ? query(
            collection(firestore, 'orders'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          )
        : null,
    [isAdmin, user, firestore]
  );

  // Select correct query
  const activeQuery = isAdmin ? adminOrdersQuery : userOrdersQuery;

  const { data: rawOrders, isLoading: isOrdersLoading } =
    useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(
      activeQuery
    );

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map((o) => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);

  const isLoading =
    isAuthLoading || isAdminLoading || isOrdersLoading;

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
