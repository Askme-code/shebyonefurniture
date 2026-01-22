'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
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
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { AuthRedirector } from '@/components/auth/AuthRedirector';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MessageDialog } from '@/components/common/MessageDialog';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    description: '',
    variant: 'error' as 'success' | 'error',
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: RegisterFormValues) => {
    if (!auth) return;
    initiateEmailSignUp(auth, data.email, data.password)
      .then(() => {
        setDialogState({
            isOpen: true,
            title: 'Account Created!',
            description: 'Welcome aboard! You will be redirected to the homepage.',
            variant: 'success'
        });
      })
      .catch((error) => {
        setDialogState({
            isOpen: true,
            title: 'Registration Failed',
            description: error.code === 'auth/email-already-in-use'
              ? 'This email is already associated with an account.'
              : 'An authentication error has occurred. Please try again.',
            variant: 'error'
        });
      });
  };

  const handleDialogClose = () => {
    const wasSuccess = dialogState.variant === 'success';
    setDialogState({ ...dialogState, isOpen: false });
    if (wasSuccess) {
      router.push('/');
    }
  }

  if (isUserLoading || (user && !user.isAnonymous)) {
    return <AuthRedirector />;
  }

  return (
    <AppLayout>
      <MessageDialog {...dialogState} onClose={handleDialogClose} />
      <div className="container flex items-center justify-center py-12 md:py-24">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">
              Create an Account
            </CardTitle>
            <CardDescription>
              Enter your details to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <GoogleSignInButton />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
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
                            placeholder="you@example.com"
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
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    Create Account
                  </Button>
                </form>
              </Form>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
