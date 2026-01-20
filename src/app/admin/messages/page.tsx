
'use client';
import { useState, useMemo } from 'react';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { collection, query, orderBy, Timestamp, doc } from 'firebase/firestore';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
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
import { Trash2, Eye, Mail, BookOpen, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
};

type RawMessage = Omit<Message, 'createdAt'> & {
  createdAt: Timestamp;
};

export default function MessagesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const messagesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'messages'), orderBy('createdAt', 'desc'))
        : null,
    [firestore]
  );

  const { data: rawMessages, isLoading } = useCollection<RawMessage>(messagesQuery);

  const messages = useMemo(() => {
    if (!rawMessages) return [];
    return rawMessages.map((m) => ({
      ...m,
      createdAt: m.createdAt?.toDate() ?? new Date(),
    }));
  }, [rawMessages]);

  const handleToggleReadStatus = (message: Message) => {
    if (!firestore) return;
    const messageRef = doc(firestore, 'messages', message.id);
    updateDocumentNonBlocking(messageRef, { isRead: !message.isRead });
    toast({
        title: `Message marked as ${!message.isRead ? 'read' : 'unread'}`,
    })
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!firestore) return;
    const messageRef = doc(firestore, 'messages', messageId);
    deleteDocumentNonBlocking(messageRef);
    setSelectedMessage(null); // Close sheet if open
    toast({
        title: "Message Deleted",
        description: "The message has been permanently removed.",
        variant: "destructive"
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span>Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Message Management</CardTitle>
          <CardDescription>
            View and manage messages from customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {messages.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead>Sender</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden sm:table-cell">Message</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {messages.map((message) => (
                        <TableRow key={message.id} className={!message.isRead ? 'font-bold' : ''}>
                        <TableCell>
                            <Badge variant={message.isRead ? 'secondary' : 'default'}>
                            {message.isRead ? 'Read' : 'New'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div>{message.name}</div>
                            <div className="text-xs text-muted-foreground">{message.email}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {message.createdAt.toLocaleDateString()}
                        </TableCell>
                         <TableCell className="hidden sm:table-cell max-w-sm">
                            <p className="truncate">{message.message}</p>
                        </TableCell>
                        <TableCell className="text-right">
                             <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                             </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                 <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-6 text-xl font-semibold">No Messages Yet</h2>
                    <p className="mt-2 text-muted-foreground">When customers contact you, their messages will appear here.</p>
                </div>
            )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{messages.length}</strong> messages.
          </div>
        </CardFooter>
      </Card>
      
      <Sheet open={!!selectedMessage} onOpenChange={(isOpen) => !isOpen && setSelectedMessage(null)}>
        <SheetContent className="sm:max-w-lg w-full flex flex-col">
            {selectedMessage && (
                <>
                    <SheetHeader>
                        <SheetTitle>Message from {selectedMessage.name}</SheetTitle>
                        <SheetDescription>
                            {selectedMessage.email} &bull; {selectedMessage.createdAt.toLocaleString()}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex-grow overflow-y-auto p-4 my-4 border rounded-md bg-muted/50 whitespace-pre-wrap">
                        {selectedMessage.message}
                    </div>
                    <SheetFooter className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this message.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteMessage(selectedMessage.id)}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button variant="secondary" size="sm" onClick={() => handleToggleReadStatus(selectedMessage)}>
                           {selectedMessage.isRead ? (
                               <>
                                <Mail className="h-4 w-4 mr-2" /> Mark as Unread
                               </>
                           ) : (
                                <>
                                <BookOpen className="h-4 w-4 mr-2" /> Mark as Read
                               </>
                           )}
                        </Button>
                    </SheetFooter>
                </>
            )}
        </SheetContent>
      </Sheet>
    </>
  );
}
