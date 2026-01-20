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

  // The query logic now depends on the user's role being fully resolved.
  const queryRef = useMemoFirebase(() => {
    // Don't create any query until we know who the user is and what their role is.
    if (isAuthLoading || isAdminLoading || !user || !firestore) {
      return null;
    }

    if (isAdmin) {
      // User is confirmed admin, create admin query for all orders.
      return query(
          collection(firestore, 'orders'),
          orderBy('createdAt', 'desc')
        );
    } else {
      // User is confirmed non-admin, create a user-specific query.
      return query(
          collection(firestore, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
    }
  }, [user, isAdmin, isAuthLoading, isAdminLoading, firestore]);

  // useCollection is safe to call here because it correctly handles a null query,
  // preventing any request from being sent until the queryRef is valid.
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

  // The overall loading state is true until both auth/admin checks are done
  // AND the subsequent data fetch (if any) is complete.
  const isLoading = isAuthLoading || isAdminLoading || (queryRef !== null && isOrdersLoading);

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
