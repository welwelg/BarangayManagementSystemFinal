import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Messages', href: '/residentuser/message' },
    { title: 'Send Message', href: '/residentuser/message/create' },
];

interface Admin {
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
    admins: Admin[];
    recipientId?: number;
    recipientName?: string;
}

export default function Create({ auth, admins, recipientId, recipientName }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        recipient_id: recipientId?.toString() || '',
        body: '',
    });

    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(admins.find((a) => a.id === recipientId) || null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(route('residentuser.message.store'), {
            onSuccess: () => {
                reset('body');
            },
        });
    }

    const handleRecipientChange = (value: string) => {
        setData('recipient_id', value);
        const admin = admins.find((a) => a.id.toString() === value);
        setSelectedAdmin(admin || null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send Message" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[50vh] flex-1 rounded-xl border border-sidebar-border/70 dark:border-gray-700">
                    <div className="m-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold dark:text-white">Send Message</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Send a message to barangay administrator</p>
                        </div>

                        <Link href={route('residentuser.message.index')}>
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
                                            <AvatarFallback className="bg-green-600 text-white">
                                                {auth.user.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        {/* Recipient Selection */}
                                        <div>
                                            <Label htmlFor="recipient">Send to Administrator</Label>
                                            <Select
                                                value={data.recipient_id}
                                                onValueChange={handleRecipientChange}
                                                disabled={!!recipientId || processing}
                                            >
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Select an administrator..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {admins.map((admin) => (
                                                        <SelectItem key={admin.id} value={admin.id.toString()}>
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="h-4 w-4" />
                                                                <div className="flex flex-col">
                                                                    <span>{admin.name}</span>
                                                                    <span className="text-xs text-muted-foreground">{admin.email}</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.recipient_id && <p className="mt-1 text-sm text-red-600">{errors.recipient_id}</p>}
                                        </div>

                                        {/* Selected Admin Info */}
                                        {selectedAdmin && (
                                            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                                                <Shield className="h-4 w-4 text-green-600" />
                                                <div>
                                                    <p className="text-sm">
                                                        Sending to: <span className="font-medium">{selectedAdmin.name}</span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{selectedAdmin.email}</p>
                                                </div>
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
                                            <div className="text-sm text-muted-foreground">Your message will be sent privately</div>
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
