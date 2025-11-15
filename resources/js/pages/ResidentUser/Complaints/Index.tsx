import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { SquareCheckBig } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Complaints', href: '/user/complaints' }];

interface Complaint {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
    resolved_at: string | null;
}

interface PageProps {
    complaints: Complaint[];
    flash?: {
        message?: string;
        type?: 'success' | 'error' | 'info';
    };
}

export default function Index() {
    const { complaints, flash } = usePage().props as PageProps;

    // Format date and time
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Complaints" />

            {/*  Flash success message */}
            {flash?.message && (
                <div className="m-4">
                    <Alert
                        className={
                            flash.type === 'error'
                                ? 'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950'
                                : 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950'
                        }
                    >
                        <SquareCheckBig className="h-4 w-4" />
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/*  Header */}
            <div className="m-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Complaints</h1>
                {complaints.length > 0 && (
                    <Link href={route('residentuser.complaints.create')}>
                        <Button>New Complaint</Button>
                    </Link>
                )}
            </div>

            {/*  Complaints Table */}
            {complaints.length > 0 ? (
                <div className="relative m-4 overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date & Time Created</th>
                                <th className="px-6 py-3">Date & Time Resolved</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((complaint, index) => {
                                const created = formatDateTime(complaint.created_at);
                                const resolved = complaint.resolved_at ? formatDateTime(complaint.resolved_at) : null;

                                return (
                                    <tr key={complaint.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{complaint.title}</td>
                                        <td className="px-6 py-4">{complaint.description}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-semibold text-white ${
                                                    complaint.status.toLowerCase() === 'resolved'
                                                        ? 'bg-green-500'
                                                        : complaint.status.toLowerCase() === 'pending'
                                                          ? 'bg-yellow-500'
                                                          : 'bg-gray-500'
                                                }`}
                                            >
                                                {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{created.date}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{created.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {resolved ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{resolved.date}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{resolved.time}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="flex gap-2 px-6 py-4">
                                            {complaint.status.toLowerCase() === 'pending' && (
                                                <>
                                                    <Link href={route('residentuser.complaints.edit', complaint.id)}>
                                                        <Button size="sm" variant="outline">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={route('residentuser.complaints.destroy', complaint.id)}
                                                        method="delete"
                                                        as="button"
                                                        onClick={(e) => {
                                                            if (!confirm('Are you sure you want to delete this complaint?')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <Button className="bg-red-500 hover:bg-red-700" size="sm" variant="destructive">
                                                            Delete
                                                        </Button>
                                                    </Link>
                                                </>
                                            )}
                                            {complaint.status.toLowerCase() === 'resolved' && (
                                                <Link
                                                    href={route('residentuser.complaints.destroy', complaint.id)}
                                                    method="delete"
                                                    as="button"
                                                    onClick={(e) => {
                                                        if (!confirm('This complaint is resolved. Are you sure you want to delete it?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <Button className="bg-red-500 hover:bg-red-700" size="sm" variant="destructive">
                                                        Delete
                                                    </Button>
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                    <SquareCheckBig size={48} className="mb-2 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">No complaints submitted yet.</p>
                    <Link href={route('residentuser.complaints.create')} className="mt-4">
                        <Button>Create Your First Complaint</Button>
                    </Link>
                </div>
            )}
        </AppLayout>
    );
}
