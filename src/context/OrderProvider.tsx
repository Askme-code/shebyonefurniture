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

  const queryRef = useMemoFirebase(() => {
    // We absolutely cannot form a query until we know the user's status.
    if (isAuthLoading || isAdminLoading || !firestore) {
      return null;
    }

    // At this point, loading is done. Now check role.
    if (isAdmin && user) {
      // User is confirmed admin, create admin query for all orders.
      return query(
        collection(firestore, 'orders'),
        orderBy('createdAt', 'desc')
      );
    } else if (user) {
      // User is confirmed non-admin, create a user-specific query.
      return query(
        collection(firestore, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
    }
    
    // No user logged in.
    return null;

  }, [user, isAdmin, isAuthLoading, isAdminLoading, firestore]);

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

  // The overall loading state is true if auth/admin checks are running, 
  // OR if they are done and a valid query is still loading from the collection.
  const isLoading = (isAuthLoading || isAdminLoading) || (queryRef !== null && isOrdersLoading);

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
