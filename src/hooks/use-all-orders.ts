'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Order } from '@/lib/types';
import { useAdmin } from './use-admin';

type OrderWithDate = Omit<Order, 'createdAt'> & { createdAt: Date };

/**
 * Custom hook to fetch all orders for the admin dashboard.
 */
export const useAllOrders = () => {
  const firestore = useFirestore();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  const queryRef = useMemoFirebase(() => {
    // Wait until we know the user's admin status
    if (isAdminLoading || !firestore) {
      return null;
    }
    // Only return the query if the user is an admin
    if (isAdmin) {
        return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
    }
    // If not an admin, return null so the useCollection hook doesn't run
    return null;
  }, [firestore, isAdmin, isAdminLoading]);

  const { data: rawOrders, isLoading: isOrdersLoading } =
    useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(queryRef);

  const orders = useMemo(() => {
    // If queryRef is null (because user is not admin), rawOrders will be null.
    if (!rawOrders) return [];
    return rawOrders.map(o => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);
  
  // Overall loading is true if we're checking admin status or fetching orders.
  const isLoading = isAdminLoading || isOrdersLoading;

  // If the user is not an admin, the hook will return empty orders and isLoading will become false.
  // This is safe and prevents permission errors.
  return { orders, isLoading };
};
