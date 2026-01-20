
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShoppingCart } from 'lucide-react';

export default function CartsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart Management</CardTitle>
        <CardDescription>
          View and manage active and abandoned shopping carts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Feature Coming Soon</h2>
            <p className="mt-2 text-muted-foreground">The ability to view and manage user carts is under development.</p>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">This feature requires carts to be stored on the server. Currently, they are stored locally on each user's device.</p>
        </div>
      </CardContent>
    </Card>
  );
}
