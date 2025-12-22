import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core'; // Added import for PageProps
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Complaints',
        href: '/admin/complaints',
    },
];

interface Complaint {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
    resolved_at?: string;
    user: { name: string };
    handler?: { name: string };
}

interface PagePropsWithComplaints extends PageProps {
    complaints: Complaint[];
}

export default function Index() {
    const { complaints } = usePage<PagePropsWithComplaints>().props;

    // Expanded filter state: Pwede nang maging date-based o status-based
    const [filter, setFilter] = useState<'all' | 'today' | 'yesterday' | 'older' | 'pending' | 'resolved'>('all');
    const [processing, setProcessing] = useState(false);

    // Format date and time (hindi binago)
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const dateStr = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        return { date: dateStr, time: timeStr };
    };

    function markResolved(complaintId: number) {
        if (confirm('Are you sure you want to mark this complaint as resolved?')) {
            setProcessing(true);
            router.put(
                route('admin.complaints.resolve', complaintId),
                {},
                {
                    onFinish: () => setProcessing(false),
                    onSuccess: () => {
                        toast.success('Complaint marked as resolved!');

                        setFilter('resolved');
                    },
                    onError: () => {
                        toast.error('Failed to resolve complaint.');
                    },
                },
            );
        }
    }

    //  Updated Filtering logic: Suporta na para sa status at date
    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const filteredComplaints = complaints.filter((c) => {
        const cDate = new Date(c.created_at).toDateString();
        const cStatus = c.status;

        // Status-based filters
        if (filter === 'pending') return cStatus === 'pending';
        if (filter === 'resolved') return cStatus === 'resolved';

        // Date-based filters (para sa 'all', 'today', etc.)
        if (filter === 'today') return cDate === todayStr;
        if (filter === 'yesterday') return cDate === yesterdayStr;
        if (filter === 'older') return cDate !== todayStr && cDate !== yesterdayStr;

        return true; // all
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Complaints" />

            <div className="bg-background p-6 text-foreground">
                <h1 className="mb-6 text-2xl font-bold text-foreground">Complaints Management</h1>
                {/* 📊 Dashboard Stats (updated for dark mode) */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="border border-border bg-card text-card-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-linear-to-br from-orange-500 to-amber-500 p-2">
                                    <MessageSquare className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{complaints.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Complaints</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border bg-card text-card-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-linear-to-br from-orange-400 to-yellow-500 p-2">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                        {complaints.filter((c) => c.status === 'pending').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border bg-card text-card-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 p-2">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {complaints.filter((c) => c.status === 'resolved').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Resolved</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* 🔎 Updated Filter buttons: Nagdagdag ng Pending at Resolved */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {/* Date-based filters */}
                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
                        All
                    </Button>
                    <Button variant={filter === 'today' ? 'default' : 'outline'} onClick={() => setFilter('today')}>
                        Today
                    </Button>
                    <Button variant={filter === 'yesterday' ? 'default' : 'outline'} onClick={() => setFilter('yesterday')}>
                        Yesterday
                    </Button>
                    <Button variant={filter === 'older' ? 'default' : 'outline'} onClick={() => setFilter('older')}>
                        Older
                    </Button>
                    {/* 🆕 Status-based filters */}
                    <Button
                        variant={filter === 'pending' ? 'default' : 'outline'}
                        onClick={() => setFilter('pending')}
                        className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === 'resolved' ? 'default' : 'outline'}
                        onClick={() => setFilter('resolved')}
                        className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    >
                        Resolved
                    </Button>
                </div>
                {/* 📋 Complaints Table (updated for dark mode) */}
                <Card className="border-border bg-card text-card-foreground">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border">
                                    <TableHead className="text-foreground">User</TableHead>
                                    <TableHead className="text-foreground">Type</TableHead>
                                    <TableHead className="text-foreground">Description</TableHead>
                                    <TableHead className="text-foreground">Status</TableHead>
                                    <TableHead className="text-foreground">Date & Time Created</TableHead>
                                    <TableHead className="text-foreground">Date & Time Resolved</TableHead>
                                    <TableHead className="text-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredComplaints.map((complaint) => {
                                    const created = formatDateTime(complaint.created_at);
                                    const resolved = complaint.resolved_at ? formatDateTime(complaint.resolved_at) : null;
                                    const isResolved = complaint.status === 'resolved';

                                    return (
                                        <TableRow
                                            key={complaint.id}
                                            className={`border-border ${complaint.status === 'pending' ? 'bg-orange-50 dark:bg-orange-950/20' : 'bg-emerald-50 dark:bg-emerald-950/20'} transition-colors duration-200`}
                                        >
                                            <TableCell className="text-foreground">{complaint.user.name}</TableCell>
                                            <TableCell className="text-foreground">{complaint.title}</TableCell>
                                            <TableCell className="text-foreground">{complaint.description}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded px-2 py-1 text-xs font-semibold text-white ${
                                                        isResolved
                                                            ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700'
                                                            : 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700'
                                                    }`}
                                                >
                                                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{created.date}</span>
                                                    <span className="text-xs text-muted-foreground">{created.time}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {resolved ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{resolved.date}</span>
                                                        <span className="text-xs text-muted-foreground">{resolved.time}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">---</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {!isResolved && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => markResolved(complaint.id)}
                                                            disabled={processing}
                                                            className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                                        >
                                                            {processing ? 'Processing...' : 'Mark Resolved'}
                                                        </Button>
                                                    )}
                                                    {isResolved && (
                                                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Resolved</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filteredComplaints.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                            No complaints found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
