import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import useTypingIndicator from '@/hooks/useTypingIndicator';
import AppLayout from '@/layouts/app-layout';
import { toast } from '@/lib/toast';
import { type BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Inbox, MoreVertical, Radio, Search, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Messages', href: '/admin/message' }];

interface Message {
    id: number;
    sender_id: number;
    recipient_id: number;
    body: string;
    is_read: boolean;
    sender_type: string;
    created_at: string;
    sender?: { id: number; name: string; email: string };
    recipient?: { id: number; name: string; email: string };
}

interface PaginatedMessages {
    data: Message[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Conversation {
    userId: number;
    userName: string;
    userEmail: string;
    messages: Message[];
    lastMessage: Message;
    unreadCount: number;
}

interface MessageSentEvent {
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
}

interface IndexProps {
    auth: { user: { id: number; name: string; email: string } };
    messages: PaginatedMessages;
    unreadCount: number;
}

interface PageProps extends InertiaPageProps {
    flash?: { message?: string; error?: string };
}

export default function Index({ auth, messages, unreadCount }: IndexProps) {
    const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { flash } = usePage<PageProps>().props;
    const markedAsReadRef = useRef(new Set<number>());

    const { isTyping, sendTyping } = useTypingIndicator({
        currentUserId: auth.user.id,
        otherUserId: selectedConversation?.userId ?? null,
    });

    // Typing indicator is handled via isTyping from useTypingIndicator

    // Handle flash messages
    useEffect(() => {
        if (flash?.message) toast.success(flash.message);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => setLocalUnreadCount(unreadCount), [unreadCount]);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    // Real-time message listener
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private(`user.${auth.user.id}`);

        channel.listen('.message.sent', (event: MessageSentEvent) => {
            setSelectedConversation((prev) => {
                if (!prev) return prev;
                if (prev.userId === event.sender_id) {
                    const incoming = {
                        id: event.id,
                        sender_id: event.sender_id,
                        recipient_id: event.recipient_id,
                        body: event.body,
                        is_read: event.is_read,
                        sender_type: event.sender_type,
                        created_at: event.created_at,
                        sender: event.sender,
                    } as Message;

                    handleMarkAsRead(event.id);

                    return {
                        ...prev,
                        messages: [...prev.messages, incoming],
                        lastMessage: incoming,
                    };
                }
                return prev;
            });

            setLocalUnreadCount((prev) => prev + 1);

            const scrollY = window.scrollY;
            router.reload({
                only: ['messages', 'unreadCount'],
                onFinish: () => window.scrollTo(0, scrollY),
            });
        });

        return () => {
            channel.stopListening('.message.sent');
            window.Echo.leave(`user.${auth.user.id}`);
        };
    }, [auth.user.id]);

    // Group messages into conversations (threads)
    const conversations = useMemo(() => {
        const convMap = new Map<number, Conversation>();

        messages.data.forEach((message) => {
            const isSent = message.sender_id === auth.user.id;
            const otherUser = isSent ? message.recipient : message.sender;
            const otherUserId = isSent ? message.recipient_id : message.sender_id;

            if (!otherUser) return;

            if (!convMap.has(otherUserId)) {
                convMap.set(otherUserId, {
                    userId: otherUserId,
                    userName: otherUser.name,
                    userEmail: otherUser.email,
                    messages: [],
                    lastMessage: message,
                    unreadCount: 0,
                });
            }

            const conv = convMap.get(otherUserId)!;
            conv.messages.push(message);

            if (new Date(message.created_at) > new Date(conv.lastMessage.created_at)) {
                conv.lastMessage = message;
            }

            if (!message.is_read && message.recipient_id === auth.user.id) {
                conv.unreadCount++;
            }
        });

        return Array.from(convMap.values()).sort(
            (a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime(),
        );
    }, [messages.data, auth.user.id]);

    const filteredConversations = conversations.filter(
        (conv) =>
            conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.lastMessage.body.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleMarkAsRead = (messageId: number) => {
        // Prevent duplicate mark as read calls
        if (markedAsReadRef.current.has(messageId)) return;
        markedAsReadRef.current.add(messageId);

        router.post(
            route('admin.message.mark-read', messageId),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setLocalUnreadCount((prev) => Math.max(0, prev - 1)),
            },
        );
    };

    // Auto mark messages as read when conversation is opened
    useEffect(() => {
        if (selectedConversation) {
            selectedConversation.messages.forEach((msg) => {
                if (!msg.is_read && msg.recipient_id === auth.user.id) {
                    handleMarkAsRead(msg.id);
                }
            });
        }
    }, [selectedConversation, auth.user.id]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedConversation || isSending) return;

        setIsSending(true);
        router.post(
            route('admin.message.store'),
            {
                recipient_id: selectedConversation.userId,
                body: messageText,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setMessageText('');

                    const tempMessage = {
                        id: Date.now(),
                        sender_id: auth.user.id,
                        recipient_id: selectedConversation.userId,
                        body: messageText,
                        is_read: true,
                        sender_type: 'admin',
                        created_at: new Date().toISOString(),
                        sender: {
                            id: auth.user.id,
                            name: auth.user.name,
                            email: auth.user.email,
                        },
                    };

                    setSelectedConversation((prev) =>
                        prev
                            ? {
                                  ...prev,
                                  messages: [...prev.messages, tempMessage],
                                  lastMessage: tempMessage,
                              }
                            : prev,
                    );

                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                },
                onError: (_errors) => {
                    toast.error('Failed to send message');
                },
                onFinish: () => {
                    setIsSending(false);
                },
            },
        );
    };

    const handleDelete = (messageId: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        router.delete(route('admin.message.destroy', messageId), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Don't show toast here - flash message will handle it
                if (selectedConversation && selectedConversation.messages.length === 1) {
                    setSelectedConversation(null);
                }
            },
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages" />

            <div className="flex h-[calc(100vh-180px)] overflow-hidden rounded-lg border bg-card bg-sky-50 dark:bg-gray-950">
                {/* Conversations List */}
                <div className="flex w-80 flex-col border-r">
                    <div className="space-y-3 border-b p-4">
                        <div className="flex items-center justify-between text-sky-950 dark:text-sky-50">
                            <div>
                                <h2 className="text-lg font-semibold">Chats</h2>
                                <p className="text-xs text-muted-foreground text-sky-900 dark:text-sky-100">{conversations.length} conversations</p>
                            </div>
                            {localUnreadCount > 0 && <Badge variant="destructive">{localUnreadCount}</Badge>}
                        </div>

                        <div className="flex gap-2">
                            <Link href={route('admin.message.create')} className="flex-1">
                                <Button
                                    className="w-full border-1 border-sky-400 bg-sky-400 text-sky-950 hover:bg-sky-500 dark:border-sky-800 dark:bg-sky-700 dark:text-sky-50 dark:hover:bg-sky-600"
                                    size="sm"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    New Chat
                                </Button>
                            </Link>
                            <Link href={route('admin.message.broadcast')}>
                                <Button className="border-sky-950 dark:border-sky-50" variant="outline" size="sm">
                                    <Radio className="h-4 w-4 text-sky-950 dark:text-sky-50" />
                                </Button>
                            </Link>
                        </div>

                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-sky-950 dark:text-sky-50" />
                            <Input
                                placeholder="Search conversations..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Inbox className="mb-2 h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">No conversations found</p>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => {
                                const isSelected = selectedConversation?.userId === conv.userId;
                                const lastMsgIsSent = conv.lastMessage.sender_id === auth.user.id;

                                return (
                                    <button
                                        key={conv.userId}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`flex w-full items-start gap-3 border-b p-3 text-left transition-colors hover:bg-accent ${
                                            isSelected ? 'bg-accent' : ''
                                        } ${conv.unreadCount > 0 ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                                                {getInitials(conv.userName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            {/* Header: Username + Date + Unread badge */}
                                            <div className="flex items-start justify-between gap-2">
                                                {/* Username */}
                                                <span className="max-w-[60%] truncate text-sm font-semibold sm:max-w-[70%]">{conv.userName}</span>

                                                {/* Date + Unread Badge */}
                                                <div className="flex flex-shrink-0 flex-col items-end text-right leading-tight">
                                                    <span className="text-[11px] text-muted-foreground sm:text-xs">
                                                        {format(new Date(conv.lastMessage.created_at), 'MMM d')}
                                                    </span>

                                                    {conv.unreadCount > 0 && (
                                                        <span className="mt-0.5 flex h-4 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white sm:h-5 sm:min-w-[1.5rem] sm:text-[11px]">
                                                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Message Preview  */}
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <p className="flex-1 truncate text-[11px] leading-snug text-muted-foreground sm:text-xs">
                                                    {lastMsgIsSent && <span className="font-medium">You: </span>}
                                                    {conv.lastMessage.body}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Thread */}
                <div className="flex flex-1 flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center gap-3 border-b bg-background p-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {getInitials(selectedConversation.userName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{selectedConversation.userName}</h3>
                                    <p className="text-xs text-muted-foreground">{selectedConversation.userEmail}</p>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                                {selectedConversation.messages
                                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                    .map((message) => {
                                        const isSent = message.sender_id === auth.user.id;

                                        return (
                                            <div key={message.id} className={`flex gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                    <AvatarFallback
                                                        className={isSent ? 'bg-primary text-xs text-primary-foreground' : 'bg-muted text-xs'}
                                                    >
                                                        {getInitials(isSent ? auth.user.name : selectedConversation.userName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={`flex max-w-[70%] flex-col gap-1 ${isSent ? 'items-end' : 'items-start'}`}>
                                                    <div
                                                        className={`group relative rounded-2xl px-3 py-2 ${
                                                            isSent ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                                        }`}
                                                    >
                                                        <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 ${
                                                                        isSent ? '-left-8' : '-right-8'
                                                                    }`}
                                                                >
                                                                    <MoreVertical className="h-3 w-3" />
                                                                </Button>
                                                            </DropdownMenuTrigger>

                                                            <DropdownMenuContent align={isSent ? 'start' : 'end'}>
                                                                {!isSent && (
                                                                    <>
                                                                        <DropdownMenuItem onClick={() => console.log('Reply to', message.id)}>
                                                                            Reply
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleDelete(message.id)}
                                                                            className="text-red-600 focus:text-red-600"
                                                                        >
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                                {isSent && (
                                                                    <>
                                                                        {!message.is_read && (
                                                                            <DropdownMenuItem onClick={() => console.log('Edit message', message.id)}>
                                                                                Edit
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuItem onClick={() => console.log('Reply to', message.id)}>
                                                                            Reply
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleDelete(message.id)}
                                                                            className="text-red-600 focus:text-red-600"
                                                                        >
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <span className="px-2 text-xs text-muted-foreground">
                                                        {format(new Date(message.created_at), 'h:mm a')}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                <div ref={messagesEndRef} />
                                {isTyping && <p className="text-xs text-muted-foreground italic">Typing...</p>}
                            </div>

                            {/* Message Input */}
                            <div className="border-t bg-background p-4">
                                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                    <div className="flex flex-1 items-center gap-2 rounded-full border bg-muted/50 px-4 py-2">
                                        <Textarea
                                            value={messageText}
                                            onChange={(e) => {
                                                setMessageText(e.target.value);
                                                sendTyping();
                                            }}
                                            placeholder="Type a message..."
                                            className="min-h-0 flex-1 resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                                            rows={1}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    e.currentTarget.form!.requestSubmit();
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="flex h-10 w-10 items-center justify-center rounded-full"
                                        disabled={!messageText.trim() || isSending}
                                    >
                                        {isSending ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3">
                            <Inbox className="h-16 w-16 text-muted-foreground" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">Your Messages</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Select a conversation to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
