'use client';
import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Determines if the current user has admin privileges by checking for a document
 * in the `roles_admin` collection that matches the user's UID.
 */
export function useAdmin() {
    const { user, isUserLoading: isUserAuthLoading } = useUser();
    const firestore = useFirestore();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(true);

    useEffect(() => {
        // We can only check for admin status if auth loading is complete.
        if (isUserAuthLoading) {
            return;
        }

        // If there's no user, they can't be an admin.
        if (!user) {
            setIsAdmin(false);
            setIsAdminLoading(false);
            return;
        }

        // If a user is logged in, check their admin status in Firestore.
        const checkAdminStatus = async () => {
            // Firestore instance might not be available on initial render
            if (!firestore) return;

            setIsAdminLoading(true);
            try {
                const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
                const adminDoc = await getDoc(adminRoleRef);
                setIsAdmin(adminDoc.exists());
            } catch (error) {
                console.error("Error checking admin status:", error);
                setIsAdmin(false); // Assume not admin on error
            } finally {
                setIsAdminLoading(false);
            }
        };

        checkAdminStatus();
    }, [user, isUserAuthLoading, firestore]);

    // The overall loading state is true if we are still checking auth OR checking the admin role.
    const isLoading = isUserAuthLoading || isAdminLoading;

    return {
        isAdmin,
        isLoading,
        user,
    };
}
