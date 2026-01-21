'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import type { Order } from '@/lib/types';

type OrderWithDate = Omit<Order, 'createdAt'> & { createdAt: Date };

/**
 * Custom hook to fetch orders for the currently authenticated user.
 */
export const useUserOrders = () => {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const queryRef = useMemoFirebase(() => {
    // Return null if services or auth status are not ready
    if (isUserLoading || !user || !firestore) {
      return null;
    }

    // For regular users, build a query filtered by their user ID.
    return query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user, isUserLoading]);

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
  const isLoading = isUserLoading || isOrdersLoading;

  return { orders, isLoading };
};
