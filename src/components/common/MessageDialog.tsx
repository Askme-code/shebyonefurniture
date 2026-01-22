'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  variant: 'success' | 'error';
}

export function MessageDialog({
  isOpen,
  onClose,
  title,
  description,
  variant,
}: MessageDialogProps) {
  if (!isOpen) return null;

  const Icon = variant === 'success' ? CheckCircle2 : XCircle;
  const iconColor = variant === 'success' ? 'text-green-500' : 'text-destructive';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[90vw] max-w-sm rounded-lg">
        <AlertDialogHeader>
          <div className="flex flex-col items-center text-center py-4">
            <Icon className={cn('h-16 w-16 mb-5', iconColor)} />
            <AlertDialogTitle className="text-2xl font-headline">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground mt-2 px-4">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center px-6 pb-4">
          <AlertDialogAction onClick={onClose} className="w-full">OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
