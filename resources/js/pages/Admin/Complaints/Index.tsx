import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Complaints',
        href: '/admin/complaints',
    },
];

export default function Index() {
    const { complaints } = usePage().props as {
        complaints: {
            id: number;
            title: string;
            description: string;
            status: string;
            created_at: string;
            resolved_at?: string;
            user: { name: string };
            handler?: { name: string };
        }[];
    };

    // 🆕 Expanded filter state: Pwede nang maging date-based o status-based
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
                        alert('Complaint marked as resolved!');
                        // 🆕 Optional: Auto-switch to 'resolved' filter pagkatapos mag-resolve
                        setFilter('resolved');
                    },
                    onError: () => {
                        alert('Failed to resolve complaint.');
                    },
                },
            );
        }
    }

    // 🧮 Updated Filtering logic: Suporta na para sa status at date
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

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Complaints Management</h1>

                {/* 📊 Dashboard Stats (hindi binago, pero updated counts) */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="border border-orange-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 p-2">
                                    <MessageSquare className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-orange-600">{complaints.length}</p>
                                    <p className="text-sm text-slate-500">Total Complaints</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-orange-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-gradient-to-br from-orange-400 to-yellow-500 p-2">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-orange-600">{complaints.filter((c) => c.status === 'pending').length}</p>
                                    <p className="text-sm text-slate-500">Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-emerald-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-2">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-emerald-600">{complaints.filter((c) => c.status === 'resolved').length}</p>
                                    <p className="text-sm text-slate-500">Resolved</p>
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
                        className="bg-orange-500 text-white hover:bg-orange-600"
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === 'resolved' ? 'default' : 'outline'}
                        onClick={() => setFilter('resolved')}
                        className="bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                        Resolved
                    </Button>
                </div>

                {/* 📋 Complaints Table (hindi binago ang structure, pero mas clear ang status) */}
                <Card>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date & Time Created</TableHead>
                                    <TableHead>Date & Time Resolved</TableHead>
                                    <TableHead>Actions</TableHead>
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
                                            className={` ${complaint.status === 'pending' ? 'bg-orange-50 font-semibold' : 'bg-emerald-50'} transition-colors duration-200`}
                                        >
                                            <TableCell>{complaint.user.name}</TableCell>
                                            <TableCell>{complaint.title}</TableCell>
                                            <TableCell>{complaint.description}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded px-2 py-1 text-xs font-semibold text-white ${
                                                        isResolved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600'
                                                    }`}
                                                >
                                                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{created.date}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{created.time}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {resolved ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{resolved.date}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{resolved.time}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">---</span>
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
                                                            className="bg-green-500 text-white hover:bg-green-600"
                                                        >
                                                            {processing ? 'Processing...' : 'Mark Resolved'}
                                                        </Button>
                                                    )}
                                                    {isResolved && <span className="text-sm font-medium text-emerald-600">Resolved</span>}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {filteredComplaints.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-gray-500">
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
