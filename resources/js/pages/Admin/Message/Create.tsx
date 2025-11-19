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
}

export default function Create({ auth, users, recipientId }: CreateProps) {
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
            <Head title="Send Message" />

            <div className="flex h-full flex-1 flex-col gap-3 overflow-x-auto rounded-xl p-2 sm:gap-4 sm:p-4">
                {/* Header Section - Responsive */}
                <div className="relative min-h-fit rounded-xl border border-sidebar-border/70 p-3 sm:p-4 md:p-6 dark:border-gray-700">
                    <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 md:flex-row md:items-center">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl font-bold sm:text-2xl dark:text-white">Send Message</h1>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Send a message to a resident user</p>
                        </div>

                        <Link href={route('admin.message.index')} className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full text-xs sm:w-auto sm:text-sm">
                                Back to Messages
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Form Card - Responsive */}
                <div className="flex-1 rounded-xl">
                    <Card className="mx-auto w-full">
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                {/* Sender Info */}
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                                    <div className="flex-shrink-0">
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12">
                                            <AvatarFallback className="bg-blue-600 text-xs font-semibold text-white sm:text-sm">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-muted-foreground sm:text-sm">Sending as</p>
                                        <p className="truncate text-sm font-semibold sm:text-base dark:text-white">{auth.user.name}</p>
                                    </div>
                                </div>

                                <div className="h-px bg-border" />

                                {/* Recipient Selection - Responsive */}
                                <div className="space-y-2 sm:space-y-3">
                                    <div>
                                        <Label htmlFor="recipient" className="text-xs font-medium sm:text-sm">
                                            Select Recipient <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.recipient_id}
                                            onValueChange={handleRecipientChange}
                                            disabled={!!recipientId || processing}
                                        >
                                            <SelectTrigger className="mt-1.5 text-xs sm:mt-2 sm:text-sm">
                                                <SelectValue placeholder="Choose a user..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs font-medium sm:text-sm">{user.name}</span>
                                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.recipient_id && <p className="mt-1 text-xs font-medium text-red-600">{errors.recipient_id}</p>}
                                    </div>

                                    {/* Selected User Info - Responsive */}
                                    {selectedUser && (
                                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-2.5 sm:p-3 md:p-4 dark:border-blue-800 dark:bg-blue-950/20">
                                            <p className="text-xs sm:text-sm">
                                                <span className="text-muted-foreground">To: </span>
                                                <span className="font-semibold dark:text-white">{selectedUser.name}</span>
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-muted-foreground">{selectedUser.email}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Message Body - Responsive */}
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <Label htmlFor="message-body" className="text-xs font-medium sm:text-sm">
                                            Message <span className="text-red-500">*</span>
                                        </Label>
                                        <span className="text-xs whitespace-nowrap text-muted-foreground">{data.body.length} / 5000</span>
                                    </div>
                                    <Textarea
                                        id="message-body"
                                        value={data.body}
                                        onChange={(e) => setData('body', e.target.value)}
                                        placeholder="Type your message here..."
                                        rows={6}
                                        maxLength={5000}
                                        className="mt-1.5 min-h-[120px] resize-none text-xs sm:mt-2 sm:min-h-[150px] sm:text-sm md:min-h-[180px]"
                                        disabled={processing}
                                    />
                                    {errors.body && <p className="text-xs font-medium text-red-600">{errors.body}</p>}
                                </div>

                                {/* Actions - Responsive */}
                                <div className="space-y-3 border-t pt-3 sm:space-y-4 sm:pt-4 md:pt-6">
                                    <p className="text-xs text-muted-foreground sm:text-sm">
                                        ✓ This message will be sent as <span className="font-medium text-sky-600 dark:text-sky-400">Admin</span>
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:flex md:justify-end md:gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => reset('body')}
                                            disabled={processing || !data.body.trim()}
                                            className="w-full py-1.5 text-xs sm:w-auto sm:py-2 sm:text-sm md:py-2"
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing || !data.body.trim() || !data.recipient_id}
                                            className="col-span-2 w-full py-1.5 text-xs sm:col-span-1 sm:w-auto sm:py-2 sm:text-sm md:py-2"
                                        >
                                            {processing ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
