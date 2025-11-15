import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Messages', href: '/admin/message' },
    { title: 'Send Message', href: '/admin/message/create' },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateProps {
    auth: {
        user: {
            id: number;
            name: string;
        };
    };
    users: User[];
    recipientId?: number;
    recipientName?: string;
}

export default function Create({ auth, users, recipientId, recipientName }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        recipient_id: recipientId?.toString() || '',
        body: '',
    });

    const [selectedUser, setSelectedUser] = useState<User | null>(users.find((u) => u.id === recipientId) || null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(route('admin.message.store'), {
            onSuccess: () => {
                reset('body');
            },
        });
    }

    const handleRecipientChange = (value: string) => {
        setData('recipient_id', value);
        const user = users.find((u) => u.id.toString() === value);
        setSelectedUser(user || null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send Message" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[50vh] flex-1 rounded-xl border border-sidebar-border/70 dark:border-gray-700">
                    <div className="m-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold dark:text-white">Send Message</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Send a message to a resident user</p>
                        </div>

                        <Link href={route('admin.message.index')}>
                            <Button variant="outline" className="w-full sm:w-auto">
                                Back
                            </Button>
                        </Link>
                    </div>

                    <div className="mx-4 mb-4">
                        <Card className="w-full max-w-2xl">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <Avatar>
                                            <AvatarFallback className="bg-blue-600 text-white">
                                                {auth.user.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        {/* Recipient Selection */}
                                        <div>
                                            <Label htmlFor="recipient">Recipient</Label>
                                            <Select
                                                value={data.recipient_id}
                                                onValueChange={handleRecipientChange}
                                                disabled={!!recipientId || processing}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Select a user..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {users.map((user) => (
                                                        <SelectItem key={user.id} value={user.id.toString()}>
                                                            <div className="flex flex-col">
                                                                <span>{user.name}</span>
                                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.recipient_id && <p className="mt-1 text-sm text-red-600">{errors.recipient_id}</p>}
                                        </div>

                                        {/* Selected User Info */}
                                        {selectedUser && (
                                            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                                                <p className="text-sm">
                                                    Sending to: <span className="font-medium">{selectedUser.name}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                                            </div>
                                        )}

                                        {/* Message Body */}
                                        <div>
                                            <Label htmlFor="message-body">Message</Label>
                                            <Textarea
                                                id="message-body"
                                                value={data.body}
                                                onChange={(e) => setData('body', e.target.value)}
                                                placeholder="Type your message here..."
                                                rows={8}
                                                className="mt-2 resize-none"
                                                disabled={processing}
                                            />
                                            {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
                                            <p className="mt-1 text-xs text-muted-foreground">{data.body.length} / 5000 characters</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between border-t pt-4">
                                            <div className="text-sm text-muted-foreground">Message will be sent as Admin</div>
                                            <div className="flex items-center gap-2">
                                                <Button type="button" variant="outline" onClick={() => reset('body')} disabled={processing}>
                                                    Clear
                                                </Button>
                                                <Button onClick={handleSubmit} disabled={processing || !data.body.trim() || !data.recipient_id}>
                                                    {processing ? 'Sending...' : 'Send Message'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
