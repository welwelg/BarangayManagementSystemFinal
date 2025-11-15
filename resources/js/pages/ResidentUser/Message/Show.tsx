import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, Reply, Shield, Trash2 } from 'lucide-react';

interface Message {
    id: number;
    sender_id: number;
    recipient_id: number;
    body: string;
    is_read: boolean;
    sender_type: string;
    created_at: string;
    sender: {
        id: number;
        name: string;
        email: string;
    };
    recipient: {
        id: number;
        name: string;
        email: string;
    };
}

interface ShowProps {
    auth: {
        user: {
            id: number;
            name: string;
            role?: string;
        };
    };
    message: Message;
    conversation: Message[];
}

export default function Show({ auth, message, conversation }: ShowProps) {
    const isRecipient = message.recipient_id === auth.user.id;
    const isSender = message.sender_id === auth.user.id;
    const isAdmin = auth.user.role === 'admin';

    // Determine route prefix based on user role
    const routePrefix = isAdmin ? 'admin' : 'residentuser';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Messages', href: `/${routePrefix}/message` },
        { title: 'View Message', href: '#' },
    ];

    const handleReply = () => {
        router.visit(
            route(`${routePrefix}.message.create`, {
                recipient_id: message.sender_id,
                recipient_name: message.sender.name,
            }),
        );
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this message?')) {
            router.delete(route(`${routePrefix}.message.destroy`, message.id), {
                onSuccess: () => {
                    router.visit(route(`${routePrefix}.message.index`));
                },
            });
        }
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Message" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[50vh] flex-1 rounded-xl border border-sidebar-border/70 dark:border-gray-700">
                    <div className="m-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold dark:text-white">Message Details</h1>
                            <p className="mt-1 text-sm text-muted-foreground">{format(new Date(message.created_at), 'MMMM d, yyyy h:mm a')}</p>
                        </div>

                        <Link href={route(`${routePrefix}.message.index`)}>
                            <Button variant="outline" className="w-full sm:w-auto">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Messages
                            </Button>
                        </Link>
                    </div>

                    <div className="mx-4 mb-4">
                        <Card className="w-full max-w-4xl">
                            <CardHeader className="border-b">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback
                                                className={message.sender_type === 'admin' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}
                                            >
                                                {getInitials(message.sender.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{message.sender.name}</h3>
                                                {message.sender_type === 'admin' && (
                                                    <Badge variant="outline" className="gap-1">
                                                        <Shield className="h-3 w-3" />
                                                        Admin
                                                    </Badge>
                                                )}
                                                {!message.is_read && isRecipient && <Badge>New</Badge>}
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>{message.sender.email}</span>
                                                <span>•</span>
                                                <span>To: {message.recipient.name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {isRecipient && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={handleReply}>
                                                <Reply className="mr-2 h-4 w-4" />
                                                Reply
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6">
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-base leading-relaxed whitespace-pre-wrap">{message.body}</p>
                                </div>

                                <div className="mt-6 border-t pt-6">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>
                                            Sent on {format(new Date(message.created_at), 'EEEE, MMMM d, yyyy')} at{' '}
                                            {format(new Date(message.created_at), 'h:mm a')}
                                        </span>
                                        <span>{message.is_read ? <Badge variant="secondary">Read</Badge> : <Badge>Unread</Badge>}</span>
                                    </div>
                                </div>

                                {isSender && (
                                    <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                                        <p className="text-sm text-muted-foreground">
                                            You sent this message to {message.recipient.name}
                                            {message.is_read && ' · Read'}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Conversation History */}
                        {conversation.length > 1 && (
                            <Card className="mt-6 w-full max-w-4xl">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">Conversation History</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {conversation.length} message(s) between you and {isSender ? message.recipient.name : message.sender.name}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {conversation.map((msg, index) => {
                                            const isOwnMessage = msg.sender_id === auth.user.id;

                                            return (
                                                <div key={msg.id}>
                                                    <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback
                                                                className={
                                                                    msg.sender_type === 'admin'
                                                                        ? 'bg-blue-500 text-xs text-white'
                                                                        : 'bg-green-500 text-xs text-white'
                                                                }
                                                            >
                                                                {getInitials(msg.sender.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className={`flex-1 ${isOwnMessage ? 'text-right' : ''}`}>
                                                            <div className="mb-1 flex items-center gap-2">
                                                                {!isOwnMessage && (
                                                                    <>
                                                                        <span className="text-sm font-medium">{msg.sender.name}</span>
                                                                        {msg.sender_type === 'admin' && (
                                                                            <Badge variant="outline" className="text-xs">
                                                                                Admin
                                                                            </Badge>
                                                                        )}
                                                                    </>
                                                                )}
                                                                {isOwnMessage && <span className="text-sm font-medium">You</span>}
                                                            </div>
                                                            <div
                                                                className={`inline-block max-w-2xl rounded-lg p-3 ${
                                                                    isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
                                                                }`}
                                                            >
                                                                <p className="text-sm break-words whitespace-pre-wrap">{msg.body}</p>
                                                            </div>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {format(new Date(msg.created_at), 'MMM d, yyyy h:mm a')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {index < conversation.length - 1 && <Separator className="my-4" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
