
'use client';
import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, Timestamp, serverTimestamp } from 'firebase/firestore';
import type { Review } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type RawReview = Omit<Review, 'createdAt'> & { createdAt: Timestamp };

export default function ReviewsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    // Fetch reviews from the private moderation collection
    const reviewsQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'reviews_private'), orderBy('createdAt', 'desc')) : null,
        [firestore]
    );

    const { data: rawReviews, isLoading } = useCollection<RawReview>(reviewsQuery);

    const reviews = useMemo(() => {
        if (!rawReviews) return [];
        return rawReviews.map(r => ({ ...r, createdAt: r.createdAt?.toDate() ?? new Date() }));
    }, [rawReviews]);

    // Handle review deletion (for both "reject" and "delete")
    const handleDeleteReview = (reviewId: string) => {
        if (!firestore) return;
        const reviewRef = doc(firestore, 'reviews_private', reviewId);
        deleteDocumentNonBlocking(reviewRef);
    };

    // Handle review approval
    const handleApproveReview = (review: Review) => {
        if (!firestore) return;
        
        const privateRef = doc(firestore, 'reviews_private', review.id);
        const publicRef = doc(firestore, 'reviews_public', review.id);

        const publicData = {
            name: review.name,
            rating: review.rating,
            message: review.message,
            createdAt: review.createdAt, // Preserve original creation date
            approvedAt: serverTimestamp(),
        };

        // 1. Create the public-facing review
        setDocumentNonBlocking(publicRef, publicData, {});
        // 2. Delete the private moderation review
        deleteDocumentNonBlocking(privateRef);

        toast({
            title: 'Review Approved',
            description: 'The review is now public.',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <span>Loading reviews...</span>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Review Management</CardTitle>
                <CardDescription>Approve, reject, or delete customer reviews.</CardDescription>
            </CardHeader>
            <CardContent>
                {reviews.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell className="font-medium">{review.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("h-4 w-4", i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground')} />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-sm truncate">{review.message}</TableCell>
                                    <TableCell>
                                        <Badge variant={review.status === 'pending' ? 'secondary' : 'destructive'}>
                                            {review.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleApproveReview(review)}>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    handleDeleteReview(review.id);
                                                    toast({ title: 'Review Rejected', variant: 'destructive'});
                                                }}>
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Reject
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        handleDeleteReview(review.id)
                                                        toast({ title: 'Review Deleted', variant: 'destructive'});
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h2 className="mt-6 text-xl font-semibold">No Pending Reviews</h2>
                        <p className="mt-2 text-muted-foreground">When customers submit new reviews, they will appear here for moderation.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{reviews.length}</strong> pending reviews.
                </div>
            </CardFooter>
        </Card>
    );
}
