'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function MyProfilePage() {
    const { user } = useUser();

    if (!user) {
        return null; // Layout handles auth check
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>View and manage your profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback className="text-2xl">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-bold">{user.displayName || "User"}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input id="displayName" defaultValue={user.displayName || ''} disabled />
                    </div>
                     <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email || ''} disabled />
                    </div>
                </div>
                 <p className="text-sm text-muted-foreground">To update your profile information, please log out and sign in with the correct account details. For email changes, contact support.</p>
            </CardContent>
        </Card>
    );
}
