'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function useAdmin() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const adminDocRef = useMemoFirebase(
        () => (firestore && user ? doc(firestore, 'roles_admin', user.uid) : null),
        [firestore, user]
    );

    const { data: adminDoc, isLoading: isAdminLoading } = useDoc(adminDocRef);

    const isAdmin = adminDoc !== null && adminDoc !== undefined;

    return {
        isAdmin,
        isLoading: isUserLoading || isAdminLoading,
    };
}
