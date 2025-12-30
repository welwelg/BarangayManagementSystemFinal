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

export default function Create({ auth, admins, recipientId }: CreateProps) {
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

            {/* Changed p-4 to p-2 on mobile for more screen real estate, md:p-4 for desktop */}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-2 md:p-4">
                <div className="relative min-h-[50vh] flex-1 rounded-xl border border-sidebar-border/70 dark:border-gray-700">

                    {/* Header Section: Stacks on mobile, Row on sm+ */}
                    <div className="m-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-xl font-bold dark:text-white sm:text-2xl">Send Message</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Send a message to barangay administrator</p>
                        </div>

                        <Link href={route('residentuser.message.index')} className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto">
                                Back
                            </Button>
                        </Link>
                    </div>

                    <div className="mx-2 mb-4 md:mx-4">
                        <Card className="w-full max-w-3xl">
                            <CardContent className="pt-6">
                                {/* Main Layout: Column on mobile, Row on md+ */}
                                <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">

                                    {/* Avatar: Centered on mobile, Left on desktop */}
                                    <div className="flex shrink-0 justify-center md:block">
                                        <Avatar className="h-12 w-12 md:h-10 md:w-10">
                                            <AvatarFallback className="bg-green-600 text-white">
                                                {auth.user.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        {/* Recipient Selection */}
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="recipient">Send to Administrator</Label>
                                            <Select
                                                value={data.recipient_id}
                                                onValueChange={handleRecipientChange}
                                                disabled={!!recipientId || processing}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select an administrator..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {admins.map((admin) => (
                                                        <SelectItem key={admin.id} value={admin.id.toString()}>
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <Shield className="h-4 w-4 shrink-0" />
                                                                <div className="flex flex-col overflow-hidden text-left">
                                                                    <span className="truncate font-medium">{admin.name}</span>
                                                                    <span className="truncate text-xs text-muted-foreground">{admin.email}</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.recipient_id && <p className="text-sm text-red-600">{errors.recipient_id}</p>}
                                        </div>

                                        {/* Selected Admin Info Box */}
                                        {selectedAdmin && (
                                            <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                                                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm">
                                                        Sending to: <span className="font-medium">{selectedAdmin.name}</span>
                                                    </p>
                                                    <p className="break-all text-xs text-muted-foreground">{selectedAdmin.email}</p>
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
                                                // Responsive rows: 5 on mobile to save space, 8 on desktop
                                                className="mt-2 min-h-[150px] resize-none"
                                                rows={8}
                                                disabled={processing}
                                            />
                                            {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
                                            <div className="mt-1 flex justify-end">
                                                <p className="text-xs text-muted-foreground">{data.body.length} / 5000</p>
                                            </div>
                                        </div>

                                        {/* Actions: Stacked on mobile, Split on sm+ */}
                                        <div className="flex flex-col-reverse gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="text-center text-xs text-muted-foreground sm:text-left">
                                                Your message will be sent privately
                                            </div>
                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => reset('body')}
                                                    disabled={processing}
                                                    className="w-full sm:w-auto"
                                                >
                                                    Clear
                                                </Button>
                                                <Button
                                                    onClick={handleSubmit}
                                                    disabled={processing || !data.body.trim() || !data.recipient_id}
                                                    className="w-full sm:w-auto"
                                                >
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
