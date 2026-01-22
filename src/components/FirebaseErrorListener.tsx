'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * In development, it throws the error to be caught by Next.js's error overlay for debugging.
 * In production, it shows a user-friendly toast notification instead of crashing the app.
 */
export function FirebaseErrorListener() {
  const [devError, setDevError] = useState<FirestorePermissionError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Always log the error to the console for debugging purposes, regardless of environment.
      console.error("Firestore Permission Error:", error.message);

      if (process.env.NODE_ENV === 'development') {
        // In development, trigger the Next.js error overlay for detailed debugging.
        setDevError(error);
      } else {
        // In production, show a non-crashing, user-friendly toast notification.
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: "You may not have permission to do that, or there was a connection issue. Please try again.",
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    // Cleanup subscription on unmount.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]); // Dependency array includes toast to ensure it's available.

  // This part only runs in development. If devError is set, throw it on the next render
  // to be caught by the React Error Boundary (Next.js error overlay).
  if (process.env.NODE_ENV === 'development' && devError) {
    throw devError;
  }

  // This component renders nothing to the UI.
  return null;
}
