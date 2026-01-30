import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Send, User } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Messages', href: '/admin/message' },
    { title: 'New Message', href: '/admin/message/create' },
];

interface UserType {
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
    users: UserType[];
    recipientId?: number;
}

export default function Create({ auth, users, recipientId }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        recipient_id: recipientId?.toString() || '',
        body: '',
    });

    const [selectedUser, setSelectedUser] = useState<UserType | null>(
        users.find((u) => u.id === recipientId) || null
    );

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

            {/* Main Container with subtle gradient background */}
            <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col items-center justify-center bg-slate-50/50 px-4 py-8 dark:bg-slate-950/50 sm:px-6">

                {/* Max width container for better readability */}
                <div className="w-full max-w-2xl space-y-6">

                    {/* Header Navigation */}
                    <div className="flex items-center justify-between">
                        <Link
                            href={route('admin.message.index')}
                            className="group flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                        >
                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white transition-all group-hover:border-slate-300 group-hover:shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            Back to Inbox
                        </Link>
                    </div>

                    <Card className="overflow-hidden border-slate-200 shadow-lg dark:border-slate-800">
                        {/* Card Header with Sender Info */}
                        <CardHeader className="bg-slate-50/50 pb-8 dark:bg-slate-900/50">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold">Compose Message</CardTitle>
                                    <CardDescription className="mt-1">
                                        Send a direct message to a resident user.
                                    </CardDescription>
                                </div>
                                {/* Sender Badge */}
                                <div className="hidden sm:flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm dark:bg-slate-950">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="bg-blue-600 text-[10px] text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {auth.user.name} (Admin)
                                    </span>
                                </div>
                            </div>
                        </CardHeader>

                        <form onSubmit={handleSubmit}>
                            <CardContent className="-mt-4 space-y-6 bg-white p-6 pt-0 dark:bg-slate-950">
                                {/* Form Grid */}
                                <div className="grid gap-6">

                                    {/* Recipient Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient" className="text-sm font-semibold">
                                            Recipient
                                        </Label>
                                        <Select
                                            value={data.recipient_id}
                                            onValueChange={handleRecipientChange}
                                            disabled={!!recipientId || processing}
                                        >
                                            <SelectTrigger className="h-11 w-full border-slate-200 bg-slate-50/50 transition-all hover:bg-slate-100 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                                                <SelectValue placeholder="Select a resident" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                                                <User className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <span className="font-medium leading-none">{user.name}</span>
                                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.recipient_id && (
                                            <p className="text-xs font-medium text-red-500 animate-in slide-in-from-top-1">
                                                {errors.recipient_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Selected User Context Box */}
                                    {selectedUser && (
                                        <div className="relative overflow-hidden rounded-lg border border-blue-100 bg-blue-50/50 p-4 transition-all animate-in fade-in zoom-in-95 dark:border-blue-900/50 dark:bg-blue-950/20">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none text-blue-900 dark:text-blue-100">
                                                        Sending to {selectedUser.name}
                                                    </p>
                                                    <p className="text-xs text-blue-600 dark:text-blue-300">
                                                        {selectedUser.email}
                                                    </p>
                                                </div>
                                                <CheckCircle2 className="h-5 w-5 text-blue-600 opacity-20 dark:text-blue-400" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Message Body */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="message-body" className="text-sm font-semibold">
                                                Message Content
                                            </Label>
                                            <span className="text-[10px] text-slate-400">
                                                {data.body.length}/5000
                                            </span>
                                        </div>
                                        <Textarea
                                            id="message-body"
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            placeholder="Type your message here..."
                                            className="min-h-[200px] resize-y rounded-lg border-slate-200 bg-slate-50/50 px-4 py-3 text-base leading-relaxed focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950"
                                            disabled={processing}
                                            maxLength={5000}
                                        />
                                        {errors.body && (
                                            <p className="text-xs font-medium text-red-500 animate-in slide-in-from-top-1">
                                                {errors.body}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>

                            {/* Footer Actions */}
                            <CardFooter className="flex flex-col-reverse gap-3 border-t bg-slate-50/50 p-6 dark:bg-slate-900/50 sm:flex-row sm:justify-between">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => reset('body')}
                                    disabled={processing || !data.body}
                                    className="w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 sm:w-auto"
                                >
                                    Clear Form
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.body.trim() || !data.recipient_id}
                                    className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto sm:min-w-[140px]"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send className="h-4 w-4" />
                                            Send Message
                                        </span>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
