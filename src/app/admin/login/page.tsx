'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth, useAdmin } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/layout/Logo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const auth = useAuth();
  const { isAdmin, isLoading } = useAdmin();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!isLoading && isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, isLoading, router]);


  const onSubmit = (data: LoginFormValues) => {
    if (!auth) return;
    initiateEmailSignIn(auth, data.email, data.password);
    toast({
      title: 'Signing In...',
      description: 'Please wait while we check your credentials.',
    });
  };
  
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2 text-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span>Verifying Session...</span>
            </div>
          </div>
        </div>
    );
  }
  
  if (isAdmin) {
      return null; // Redirect is handling this
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-4">
                <div className="mx-auto">
                     <Logo />
                </div>
                <CardTitle className="text-2xl font-headline">Admin Portal</CardTitle>
                <CardDescription>Enter your credentials to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input
                                type="email"
                                placeholder="admin@example.com"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                            <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Sign In
                    </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
