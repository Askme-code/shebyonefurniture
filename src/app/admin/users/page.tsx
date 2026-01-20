'use client';
import { useMemo } from 'react';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  setDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { collection, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

// Define the UserProfile type based on the Firestore structure
type UserProfile = {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  lastLoginAt: Date;
  isAdmin: boolean;
};

// Raw type from Firestore, with Timestamps
type RawUserProfile = Omit<UserProfile, 'createdAt' | 'lastLoginAt' | 'isAdmin'> & {
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
};

export default function UsersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  // 1. Fetch all users
  const usersQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'users'), orderBy('createdAt', 'desc'))
        : null,
    [firestore]
  );
  const { data: rawUsers, isLoading: isLoadingUsers } =
    useCollection<RawUserProfile>(usersQuery);

  // 2. Fetch all admin roles
  const adminRolesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'roles_admin') : null),
    [firestore]
  );
  const { data: adminRoles, isLoading: isLoadingAdmins } = useCollection<{
    role: string;
  }>(adminRolesQuery);

  // 3. Combine data and memoize
  const users = useMemo((): UserProfile[] => {
    if (!rawUsers || !adminRoles) return [];
    const adminIds = new Set(adminRoles.map((role) => role.id));
    return rawUsers.map((user) => ({
      ...user,
      createdAt: user.createdAt?.toDate() ?? new Date(),
      lastLoginAt: user.lastLoginAt?.toDate() ?? new Date(),
      isAdmin: adminIds.has(user.id),
    }));
  }, [rawUsers, adminRoles]);

  const isLoading = isLoadingUsers || isLoadingAdmins;

  // 4. Handle role change
  const handleRoleChange = (user: UserProfile, makeAdmin: boolean) => {
    if (!firestore) return;

    const adminRoleRef = doc(firestore, 'roles_admin', user.id);
    if (makeAdmin) {
      setDocumentNonBlocking(
        adminRoleRef,
        { id: user.id, role: 'admin' },
        { merge: false }
      );
      toast({
        title: 'Admin Granted',
        description: `${user.displayName || user.email} is now an admin.`,
      });
    } else {
      deleteDocumentNonBlocking(adminRoleRef);
      toast({
        title: 'Admin Revoked',
        description: `${user.displayName || user.email} is no longer an admin.`,
      });
    }
  };

  // 5. Handle user deletion
  const handleDeleteUser = (user: UserProfile) => {
    if (!firestore) return;

    const userRef = doc(firestore, 'users', user.id);
    deleteDocumentNonBlocking(userRef);

    if (user.isAdmin) {
      const adminRoleRef = doc(firestore, 'roles_admin', user.id);
      deleteDocumentNonBlocking(adminRoleRef);
    }

    toast({
      title: 'User Deleted',
      description: `${
        user.displayName || user.email
      } has been deleted from Firestore.`,
      variant: 'destructive',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          View and manage your application users and their roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Last Login</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage
                          src={user.photoURL || undefined}
                          alt={user.displayName || 'user'}
                        />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            {user.displayName || 'N/A'}
                        </p>
                         <p className="text-sm text-muted-foreground sm:hidden">
                            {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.lastLoginAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`admin-switch-${user.id}`}
                        checked={user.isAdmin}
                        onCheckedChange={(checked) =>
                          handleRoleChange(user, checked)
                        }
                        aria-label={`Toggle admin role for ${user.displayName || user.email}`}
                      />
                      <Label htmlFor={`admin-switch-${user.id}`} className="hidden lg:block">
                        {user.isAdmin ? 'Admin' : 'Customer'}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete User</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete the user's profile data from your
                            database. This action does not delete their
                            authentication account. Are you sure you want to
                            proceed?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">No Users Found</h2>
            <p className="mt-2 text-muted-foreground">As users register, they will appear here.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{users.length}</strong> users.
        </div>
      </CardFooter>
    </Card>
  );
}
