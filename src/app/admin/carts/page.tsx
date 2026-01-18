import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
        <p>Cart management interface will be here.</p>
      </CardContent>
    </Card>
  );
}
