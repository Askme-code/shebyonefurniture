'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { initiateGoogleSignIn } from '@/firebase/non-blocking-login';

export function GoogleSignInButton() {
  const auth = useAuth();

  const handleGoogleSignIn = () => {
    initiateGoogleSignIn(auth);
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
      <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8C0 120.3 106.5 8 244 8s244 112.3 244 253.8zM132 258.4c0 58.3 47.3 105.6 105.6 105.6s105.6-47.3 105.6-105.6S295.9 152.8 237.6 152.8s-105.6 47.4-105.6 105.6zm238.2-2.3c-5.5-29.3-25.2-51.5-50.5-63.5 16.3-17.7 26.3-41.5 26.3-68.2 0-59.5-48.3-107.8-107.8-107.8S130 54.3 130 113.8c0 26.7 10 50.5 26.3 68.2-25.3 12-45 34.2-50.5 63.5H10.1c16.3-88.5 91-155.6 179.9-155.6s163.6 67.1 179.9 155.6h-21.8z"></path>
      </svg>
      Sign in with Google
    </Button>
  );
}
