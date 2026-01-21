
'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, useUser } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Link from 'next/link';

// Schema for the review form
const reviewSchema = z.object({
  rating: z.number().min(1, "Please provide a rating.").max(5),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ReviewFormValues = z.infer<typeof reviewSchema>;

// Raw type from Firestore
type RawReview = Omit<Review, 'createdAt' | 'status' | 'userId'> & { createdAt: Timestamp };

export function TestimonialsSection() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, message: "" },
  });

  // Fetch approved reviews from the public collection
  const reviewsQuery = useMemoFirebase(
    () => firestore ? query(
      collection(firestore, 'reviews_public'),
      orderBy('createdAt', 'desc')
    ) : null,
    [firestore]
  );
  const { data: rawReviews, isLoading } = useCollection<RawReview>(reviewsQuery);

  const reviews = useMemo(() => {
    if (!rawReviews) return [];
    return rawReviews.map(r => ({ ...r, createdAt: r.createdAt?.toDate() ?? new Date() } as Review));
  }, [rawReviews]);

  // Form submission handler
  const onSubmit = (data: ReviewFormValues) => {
    if (!firestore) return;
    if (!user) {
        toast({
            title: "Authentication Required",
            description: "You must be logged in to submit a review.",
            variant: "destructive",
        });
        return;
    }

    // Submit new reviews to the private collection for moderation
    const reviewsCollection = collection(firestore, 'reviews_private');
    addDocumentNonBlocking(reviewsCollection, {
      userId: user.uid,
      name: user.displayName || user.email || 'Anonymous User',
      rating: data.rating,
      message: data.message,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback. Your review is pending approval.",
    });
    form.reset();
    setSelectedRating(0);
  };

  return (
    <section className="relative py-16 sm:py-24 bg-card">
        <div className="absolute inset-0">
            <Image 
                src="/image/review/review.png"
                alt="Decorative background"
                fill
                className="object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline tracking-tight sm:text-4xl">What Our Customers Say</h2>
                <p className="mt-4 text-lg text-muted-foreground">Hear from those who have experienced our craftsmanship.</p>
            </div>
            
            {/* Display Approved Reviews */}
            {!isLoading && reviews.length > 0 && (
                <div className="mb-16">
                     <Carousel opts={{ align: 'start', loop: true }} className="w-full max-w-4xl mx-auto">
                        <CarouselContent>
                            {reviews.map((review) => (
                                <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1 h-full">
                                        <Card className="flex flex-col justify-between h-full text-center p-6 bg-background/80 backdrop-blur-sm">
                                            <div>
                                                <div className="flex justify-center mb-4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={cn("h-5 w-5", i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground')} />
                                                    ))}
                                                </div>
                                                <p className="text-muted-foreground italic">"{review.message}"</p>
                                            </div>
                                            <p className="mt-4 font-bold font-headline text-lg">- {review.name}</p>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </div>
            )}

            {/* Review Submission Form */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div>
                    <h3 className="text-3xl font-headline mb-4">Share Your Experience</h3>
                    <p className="text-muted-foreground">
                        Your feedback helps us grow and continue to provide the best quality furniture and service. Let us know how we did!
                    </p>
                </div>
                <Card className="p-6 sm:p-8 bg-background/80 backdrop-blur-sm shadow-xl">
                    {user ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Rating</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((value) => (
                                                        <Star
                                                            key={value}
                                                            className={cn(
                                                                "h-8 w-8 cursor-pointer transition-colors",
                                                                (hoveredRating >= value || selectedRating >= value)
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-muted-foreground'
                                                            )}
                                                            onMouseEnter={() => setHoveredRating(value)}
                                                            onMouseLeave={() => setHoveredRating(0)}
                                                            onClick={() => {
                                                                setSelectedRating(value);
                                                                field.onChange(value);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Review</FormLabel>
                                            <FormControl><Textarea placeholder="Tell us about your experience..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>Submit Review</Button>
                            </form>
                        </Form>
                    ) : (
                        <div className="text-center">
                            <p className="mb-4 text-muted-foreground">Please log in to submit a review.</p>
                            <Button asChild>
                                <Link href="/login">Log In</Link>
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    </section>
  );
}

    