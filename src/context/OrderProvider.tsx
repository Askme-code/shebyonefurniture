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
  const { isAdmin, isLoading: isAdminCheckLoading } = useAdmin();

  // The query should only be constructed when we have all the information.
  // Until then, it should be null.
  const queryRef = useMemoFirebase(() => {
    if (isAuthLoading || isAdminCheckLoading || !firestore) {
      return null; // Not ready to query yet.
    }

    // After loading, if there's no user, there are no orders to fetch.
    if (!user) {
        return null;
    }
    
    // If the user is an admin, fetch all orders.
    if (isAdmin) {
      return query(
        collection(firestore, 'orders'),
        orderBy('createdAt', 'desc')
      );
    } 
    
    // If it's a regular user, fetch only their orders.
    return query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [user, isAdmin, isAuthLoading, isAdminCheckLoading, firestore]);

  // Always call the useCollection hook, but pass it the potentially null queryRef.
  // The hook is designed to handle a null input and will not fetch data in that case.
  const { data: rawOrders, isLoading: isOrdersLoading } =
    useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(
      queryRef
    );

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map(o => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);

  // The overall loading state is true if we are waiting for auth, admin check, or the orders themselves.
  const isLoading = isAuthLoading || isAdminCheckLoading || isOrdersLoading;

  return (
    <OrderContext.Provider value={{ orders, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};
