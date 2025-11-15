import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Radio, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Messages', href: '/admin/message' },
    { title: 'Broadcast Message', href: '/admin/message-broadcast' },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface BroadcastProps {
    auth: {
        user: {
            id: number;
            name: string;
        };
    };
    users: User[];
}

interface PageProps {
    flash?: {
        message?: string;
        error?: string;
        success?: string;
    };
}

export default function Broadcast({ auth, users }: BroadcastProps) {
    const { data, setData, post, processing, errors } = useForm({
        recipient_ids: [] as number[],
        body: '',
    });

    const [selectAll, setSelectAll] = useState(false);
    const { flash } = usePage<PageProps>().props;

    // Handle flash messages
    useEffect(() => {
        if (flash?.message) toast.success(flash.message);
        if (flash?.error) toast.error(flash.error);
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            setData(
                'recipient_ids',
                users.map((u) => u.id),
            );
        } else {
            setData('recipient_ids', []);
        }
    };

    const handleUserToggle = (userId: number, checked: boolean) => {
        if (checked) {
            setData('recipient_ids', [...data.recipient_ids, userId]);
        } else {
            setData(
                'recipient_ids',
                data.recipient_ids.filter((id) => id !== userId),
            );
            setSelectAll(false);
        }
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(route('admin.message.broadcast'), {
            onSuccess: () => {
                toast.success(`Broadcast sent to ${data.recipient_ids.length} users!`);
            },
            onError: () => {
                toast.error('Failed to send broadcast message');
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Broadcast Message" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[50vh] flex-1 rounded-xl border border-sidebar-border/70 dark:border-gray-700">
                    <div className="m-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-bold dark:text-white">
                                <Radio className="h-6 w-6" />
                                Broadcast Message
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">Send a message to multiple users at once</p>
                        </div>

                        <Link href={route('admin.message.index')}>
                            <Button variant="outline" className="w-full sm:w-auto">
                                Back
                            </Button>
                        </Link>
                    </div>

                    <div className="mx-4 mb-4 grid gap-4 md:grid-cols-2">
                        {/* Recipients Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-lg">
                                    <span className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Select Recipients
                                    </span>
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {data.recipient_ids.length} of {users.length} selected
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Select All */}
                                    <div className="flex items-center space-x-2 border-b pb-3">
                                        <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
                                        <label
                                            htmlFor="select-all"
                                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Select All Users
                                        </label>
                                    </div>

                                    {/* User List */}
                                    <div className="max-h-96 space-y-3 overflow-y-auto">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-start space-x-2 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <Checkbox
                                                    id={`user-${user.id}`}
                                                    checked={data.recipient_ids.includes(user.id)}
                                                    onCheckedChange={(checked) => handleUserToggle(user.id, checked as boolean)}
                                                />
                                                <label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer text-sm">
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {errors.recipient_ids && <p className="text-sm text-red-600">{errors.recipient_ids}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Message Composition */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Message Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="broadcast-message">Message</Label>
                                        <Textarea
                                            id="broadcast-message"
                                            value={data.body}
                                            onChange={(e) => setData('body', e.target.value)}
                                            placeholder="Type your broadcast message here..."
                                            rows={12}
                                            className="mt-2 resize-none"
                                            disabled={processing}
                                        />
                                        {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
                                        <p className="mt-1 text-xs text-muted-foreground">{data.body.length} / 5000 characters</p>
                                    </div>

                                    {/* Preview */}
                                    {data.recipient_ids.length > 0 && data.body && (
                                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                                            <h4 className="mb-2 text-sm font-medium">Preview</h4>
                                            <p className="text-sm">
                                                This message will be sent to <span className="font-bold">{data.recipient_ids.length}</span> user(s)
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 border-t pt-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                setData('body', '');
                                                setData('recipient_ids', []);
                                                setSelectAll(false);
                                            }}
                                            disabled={processing}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            className="flex-1"
                                            disabled={processing || !data.body.trim() || data.recipient_ids.length === 0}
                                        >
                                            {processing ? 'Sending...' : 'Send Broadcast'}
                                        </Button>
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
