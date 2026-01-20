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

  // This flag determines if we are ready to create a query. It ensures all
  // authentication and admin checks are complete before proceeding.
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

  // The useCollection hook is called unconditionally as required by React,
  // but it is designed to handle a null queryRef and will not fetch data
  // until the query is valid.
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

  // The overall loading state is true until all prerequisites are met and
  // the data has actually been fetched.
  const isLoading = isAuthLoading || isAdminLoading || (canQuery && isOrdersLoading) || (!queryRef && !isAuthLoading && !isAdminLoading);

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
