'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { useAdmin } from '@/hooks/use-admin';
import type { Order } from '@/lib/types';

type OrderWithDate = Omit<Order, 'createdAt'> & { createdAt: Date };

/**
 * Custom hook to fetch orders.
 * - For normal users, it fetches only their own orders.
 * - For admins, it fetches all orders.
 */
export const useOrders = () => {
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  const queryRef = useMemoFirebase(() => {
    // Return null if services or auth status are not ready
    if (isAuthLoading || isAdminLoading || !firestore) {
      return null;
    }

    // Return null if no user is logged in
    if (!user) {
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

  // useCollection is designed to handle a null queryRef, it will wait until it's not null.
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

  return { orders, isLoading };
};
