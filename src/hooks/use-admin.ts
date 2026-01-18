'use client';
import { useUser } from '@/firebase';

/**
 * Determines if the current user has admin privileges.
 * NOTE: For this starter project, any signed-in user is considered an admin.
 * For production, you should implement a secure role-based access control system
 * (e.g., checking for a custom claim or a document in a 'roles' collection in Firestore).
 */
export function useAdmin() {
    const { user, isUserLoading } = useUser();

    // In this simplified setup, any logged-in user is treated as an admin.
    const isAdmin = !!user;

    return {
        isAdmin,
        isLoading: isUserLoading,
    };
}
