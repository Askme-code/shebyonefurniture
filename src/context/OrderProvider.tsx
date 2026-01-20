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

  // This flag is the master gate: we can only query if auth and admin checks are done, and we have a user.
  const canQuery = !!firestore && !isAuthLoading && !isAdminLoading && !!user;

  const queryRef = useMemoFirebase(() => {
    // If we can't query yet, return null. The useCollection hook will wait.
    if (!canQuery) {
      return null;
    }

    // Return the appropriate query based on the user's role.
    return isAdmin
      ? query(
          collection(firestore, 'orders'),
          orderBy('createdAt', 'desc')
        )
      : query(
          collection(firestore, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
  }, [canQuery, isAdmin, firestore, user]);

  const { data: rawOrders, isLoading: isOrdersLoadingFromHook } =
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

  // We are in a loading state if we are still waiting for auth/admin checks,
  // OR if the query is now running.
  const isLoading = !canQuery || isOrdersLoadingFromHook;

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
