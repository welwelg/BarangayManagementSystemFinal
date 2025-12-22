import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

// Define the Status Type explicitly
type BlotterStatus = 'pending' | 'approved' | 'rejected';

interface Blotter {
    id: number;
    type: string;
    description: string;
    respondent_name: string | null;
    status: BlotterStatus;
    created_at: string;
    scheduled_at: string | null;
    admin_notes: string | null;
    user: {
        name: string;
        email: string;
    };
}

export default function Edit({ blotter }: { blotter: Blotter }) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Blotter Management', href: '/admin/blotter' },
        { title: 'Review Report', href: `/admin/blotter/${blotter.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        status: (blotter.status || 'pending') as BlotterStatus,
        scheduled_at: blotter.scheduled_at || '',
        admin_notes: blotter.admin_notes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        //  NEW VALIDATION: Check if status is still pending
        if (data.status === 'pending') {
            toast.error("You need to change the status from 'Pending Review' before saving.");
            return; // Stop the form submission
        }

        put(route('admin.blotter.update', blotter.id), {
            onSuccess: () => toast.success('Blotter status updated and Email sent successfully.'),
            onError: () => toast.error('Please check the form for errors.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Review Blotter #${blotter.id}`} />

            <div className="py-12 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Resident Report Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resident Report Details</CardTitle>
                                <CardDescription>
                                    Filed by {blotter.user.name} on {new Date(blotter.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-gray-500">Incident Type</Label>
                                        <div className="font-semibold text-lg">{blotter.type}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-gray-500">Respondent</Label>
                                        <div className="font-semibold text-lg">{blotter.respondent_name || 'N/A'}</div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label className="text-gray-500">Description of Incident</Label>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md text-sm leading-relaxed whitespace-pre-wrap">
                                        {blotter.description}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Admin Action Form */}
                    <div className="lg:col-span-1">
                        <Card className="border-blue-200 shadow-md">
                            <CardHeader className="bg-blue-50/50 dark:bg-blue-900/20">
                                <CardTitle>Admin Action</CardTitle>
                                <CardDescription>Update status and schedule hearing.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={submit} className="space-y-6">

                                    {/* 1. Status Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            onValueChange={(value) => setData('status', value as BlotterStatus)}
                                            value={data.status}
                                            name="status"
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* Optional: You can disable "pending" so they can't re-select it if it was already changed,
                                                    but usually keeping it selectable is fine as long as validation catches it. */}
                                                <SelectItem value="pending">Pending Review</SelectItem>
                                                <SelectItem value="approved">Approve & Schedule</SelectItem>
                                                <SelectItem value="rejected">Reject Report</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>

                                    {/* 2. Schedule Date */}
                                    {data.status !== 'rejected' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="scheduled_at">
                                                Hearing Schedule <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="scheduled_at"
                                                name="scheduled_at"
                                                type="datetime-local"
                                                value={data.scheduled_at}
                                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                                className={data.status === 'approved' ? 'border-blue-400' : ''}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Required if approving.
                                            </p>
                                            <InputError message={errors.scheduled_at} />
                                        </div>
                                    )}

                                    {/* 3. Admin Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_notes">Admin Notes</Label>
                                        <Textarea
                                            id="admin_notes"
                                            name="admin_notes"
                                            placeholder="Enter instructions..."
                                            value={data.admin_notes}
                                            onChange={(e) => setData('admin_notes', e.target.value)}
                                            className="min-h-[120px]"
                                        />
                                        <InputError message={errors.admin_notes} />
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={processing}
                                            variant={data.status === 'rejected' ? 'destructive' : 'default'}
                                        >
                                            {processing ? 'Processing...' : 'Save & Notify User'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="bg-gray-50 dark:bg-gray-900/50 p-4">
                                <Button variant="ghost" className="w-full" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
