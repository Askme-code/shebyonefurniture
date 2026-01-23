'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MessageCircle, Mail, MapPin, Send } from 'lucide-react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';


const quoteSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  whatsapp: z.string().optional(),
  country: z.string().optional(),
  heardFrom: z.string().optional(),
  requirements: z.string().min(10, "Please share some details about your project."),
  file: z.any().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const contactInfo = [
    {
        icon: MessageCircle,
        title: 'WhatsApp Us',
        value: '+255 686 587 266',
        href: 'https://wa.me/255686587266',
    },
    {
        icon: Mail,
        title: 'Email Us',
        value: 'contact@shaabanfurniture.com',
        href: 'mailto:contact@shaabanfurniture.com',
    },
    {
        icon: MapPin,
        title: 'Reach Us',
        value: 'Zanzibar, Tanzania',
        href: 'https://share.google/ZeHHqoAqYboDU6Tkx',
    }
]

export function QuoteSection() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const quoteBgImage = PlaceHolderImages.find(p => p.id === 'quote-bg');
  
    const form = useForm<QuoteFormValues>({
      resolver: zodResolver(quoteSchema),
      defaultValues: {
        name: "",
        email: "",
        whatsapp: "",
        country: "",
        heardFrom: "",
        requirements: "",
      },
    });
  
    const onSubmit = (data: QuoteFormValues) => {
       if (!firestore) {
        toast({
          title: "Error",
          description: "Could not submit your request. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      const messagesCollection = collection(firestore, 'messages');
      const messagePayload = {
        name: data.name,
        email: data.email,
        message: `Quote Request:\n\nRequirements: ${data.requirements}`,
        whatsapp: data.whatsapp,
        country: data.country,
        heardFrom: data.heardFrom,
        createdAt: serverTimestamp(),
        isRead: false,
        type: 'Quote'
      };
      addDocumentNonBlocking(messagesCollection, messagePayload);
  
      toast({
        title: "Quote Request Sent!",
        description: "Thank you for your interest. We will get back to you within 8 hours.",
      });
      form.reset();
    };

    return (
        <section className="relative bg-zinc-900 text-white py-16 sm:py-24">
            {quoteBgImage && (
                <Image
                    src={quoteBgImage.imageUrl}
                    alt={quoteBgImage.description}
                    fill
                    className="object-cover opacity-20"
                    data-ai-hint={quoteBgImage.imageHint}
                />
            )}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div>
                            <span className="text-primary font-semibold relative after:content-[''] after:absolute after:w-12 after:h-0.5 after:bg-primary after:left-full after:ml-3 after:top-1/2">Contact Us</span>
                            <h2 className="font-headline text-4xl mt-2">Get A Free Quote For Your Future Projects</h2>
                        </div>
                        {contactInfo.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="bg-primary h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0">
                                    <item.icon className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{item.title}</h3>
                                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        {item.value}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-zinc-800/50 backdrop-blur-sm p-8 rounded-lg border border-zinc-700">
                        <p className="text-center text-sm text-muted-foreground mb-6">We will reply in 8 hours.</p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Name" className="bg-zinc-700 border-zinc-600 placeholder:text-zinc-400" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="email" placeholder="Email" className="bg-zinc-700 border-zinc-600 placeholder:text-zinc-400" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="whatsapp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="WhatsApp" className="bg-zinc-700 border-zinc-600 placeholder:text-zinc-400" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Country" className="bg-zinc-700 border-zinc-600 placeholder:text-zinc-400" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="heardFrom"
                                    render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-700 border-zinc-600 placeholder:text-zinc-400">
                                                    <SelectValue placeholder="Where did you hear about us?" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                                <SelectItem value="google">Google Search</SelectItem>
                                                <SelectItem value="social">Social Media</SelectItem>
                                                <SelectItem value="friend">From a Friend</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="requirements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea placeholder="Your specific requirements (Share your project details or buying list to get Quotation)" className="min-h-24 bg-zinc-700 border-zinc-600 placeholder:text-zinc-400" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-wrap items-center gap-4">
                                     <FormField
                                        control={form.control}
                                        name="file"
                                        render={() => (
                                            <FormItem>
                                            <FormLabel className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer bg-zinc-700 border-zinc-600 hover:bg-zinc-600 text-white")}>
                                                Choose Files
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="file" className="hidden" />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormDescription className="text-xs text-zinc-400">Max 5MB in jpg, pdf, png.</FormDescription>
                                </div>
                                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                                    <Send className="mr-2 h-4 w-4" /> REQUEST
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    );
}