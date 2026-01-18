'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useMemo } from 'react';

type Subscriber = {
    id: string;
    email: string;
    createdAt: Date;
}

type RawSubscriber = Omit<Subscriber, 'createdAt'> & {
    createdAt: Timestamp;
}

export default function SubscribersPage() {
    const firestore = useFirestore();

    const subscribersQuery = useMemoFirebase(
        () => (firestore ? query(collection(firestore, 'newsletter_subscribers'), orderBy('createdAt', 'desc')) : null),
        [firestore]
    );

    const { data: rawSubscribers, isLoading } = useCollection<RawSubscriber>(subscribersQuery);

    const subscribers = useMemo(() => {
        if (!rawSubscribers) return [];
        return rawSubscribers.map(s => ({
            ...s,
            createdAt: s.createdAt?.toDate() ?? new Date(),
        }));
    }, [rawSubscribers]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <span>Loading subscribers...</span>
                </div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
                <CardDescription>
                    A list of users who have subscribed to your newsletter.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Subscription Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscribers.map((subscriber) => (
                            <TableRow key={subscriber.id}>
                                <TableCell className="font-medium">{subscriber.email}</TableCell>
                                <TableCell>{subscriber.createdAt.toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
             <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{subscribers.length}</strong> subscribers.
                </div>
            </CardFooter>
        </Card>
    );
}
