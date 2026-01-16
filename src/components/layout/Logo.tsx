import { Palmtree } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Palmtree className="h-7 w-7 text-primary" />
      <span className="font-headline text-xl font-bold tracking-tight">
        Sheby One Furniture
      </span>
    </div>
  );
}
