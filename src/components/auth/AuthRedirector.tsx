'use client';
import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppLayout } from '../layout/AppLayout';

export function AuthRedirector() {
    const { isAdmin, user, isLoading } = useAdmin();
    const router = useRouter();

    useEffect(() => {
        // Only redirect once loading is complete and we have a user
        if (!isLoading && user) {
            if (isAdmin) {
                router.push('/admin');
            } else {
                router.push('/account');
            }
        }
    }, [isLoading, user, isAdmin, router]);

    return (
        <AppLayout>
            <div className="container flex items-center justify-center py-24">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2 text-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        <span>Signing in...</span>
                    </div>
                    <p className="text-muted-foreground">
                        Checking your credentials and redirecting...
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
