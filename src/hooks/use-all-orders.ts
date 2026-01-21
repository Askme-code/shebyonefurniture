'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Order } from '@/lib/types';

type OrderWithDate = Omit<Order, 'createdAt'> & { createdAt: Date };

/**
 * Custom hook to fetch all orders for the admin dashboard.
 */
export const useAllOrders = () => {
  const firestore = useFirestore();

  const queryRef = useMemoFirebase(() => {
    if (!firestore) {
      return null;
    }
    // For admins, query the entire collection.
    return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: rawOrders, isLoading: isOrdersLoading } =
    useCollection<Omit<Order, 'createdAt'> & { createdAt: Timestamp }>(queryRef);

  const orders = useMemo(() => {
    if (!rawOrders) return [];
    return rawOrders.map(o => ({
      ...o,
      createdAt: o.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawOrders]);

  return { orders, isLoading: isOrdersLoading };
};
