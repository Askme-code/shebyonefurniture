import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          View and manage your application users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>User management interface will be here.</p>
      </CardContent>
    </Card>
  );
}
