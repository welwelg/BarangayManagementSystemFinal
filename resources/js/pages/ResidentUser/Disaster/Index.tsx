import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, SquareCheckBig } from 'lucide-react';
import { useState } from 'react';
import { MdPending } from 'react-icons/md';
import { TbProgressCheck } from 'react-icons/tb';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Disaster Reports',
        href: '/residentuser/disaster-reports',
    },
];

interface DisasterReport {
    id: number;
    disaster_type: string;
    description: string;
    location: string;
    occurred_at: string;
    status: string;
    created_at: string;
    resolved_at: string | null;
}

interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface PageProps {
    disasterReports: PaginatedData<DisasterReport>;
    flash?: {
        message?: string;
    };
}

export default function Index() {
    const { disasterReports, flash } = usePage().props as PageProps;

    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredReports = filterStatus === 'all' ? disasterReports.data : disasterReports.data.filter((report) => report.status === filterStatus);

    const handleFilterChange = (status: string) => {
        setFilterStatus(status);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    className: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
                    icon: <MdPending />,
                    label: 'Pending',
                };
            case 'in-progress':
                return {
                    className: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
                    icon: <Spinner />,
                    label: 'In Progress',
                };
            case 'resolved':
                return {
                    className:
                        'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
                    icon: <TbProgressCheck />,
                    label: 'Resolved',
                };
            default:
                return {
                    className: 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
                    icon: '❓',
                    label: 'Unknown',
                };
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
    };

    const handlePageChange = (url: string | null) => {
        if (url) router.visit(url);
    };

    const renderActionButtons = (disasterReport: DisasterReport) => {
        if (disasterReport.status === 'pending') {
            return (
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Link href={route('disaster-reports.edit', disasterReport.id)}>
                        <Button size="sm" variant="outline" className="w-full sm:w-auto">
                            Edit
                        </Button>
                    </Link>
                    <Link
                        href={route('disaster-reports.destroy', disasterReport.id)}
                        method="delete"
                        as="button"
                        onClick={(e) => {
                            if (!confirm('Are you sure you want to delete this report?')) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <Button size="sm" variant="destructive" className="w-full bg-red-500 hover:bg-red-700 sm:w-auto">
                            Delete
                        </Button>
                    </Link>
                </div>
            );
        }

        if (disasterReport.status === 'in-progress') {
            return <span className="text-sm text-gray-500 dark:text-gray-400">In Progress</span>;
        }

        if (disasterReport.status === 'resolved') {
            return (
                <div className="flex flex-col gap-2 sm:flex-row">
                    <span className="text-sm text-green-600 dark:text-green-400">Resolved</span>
                    <Link
                        href={route('disaster-reports.destroy', disasterReport.id)}
                        method="delete"
                        as="button"
                        onClick={(e) => {
                            if (!confirm('This report is resolved. Do you still want to delete it?')) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <Button size="sm" variant="destructive" className="w-full bg-red-500 hover:bg-red-700 sm:w-auto">
                            Delete
                        </Button>
                    </Link>
                </div>
            );
        }

        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Disaster Report" />

            {/* Flash Message */}
            <div className="m-4">
                {flash?.message && (
                    <Alert>
                        <SquareCheckBig />
                        <AlertTitle>Notification!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Header */}
            <div className="m-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold dark:text-white">My Disaster Reports</h1>
                {disasterReports.data.length > 0 && (
                    <Link href={route('disaster-reports.create')}>
                        <Button className="w-full sm:w-auto">Add Disaster Report</Button>
                    </Link>
                )}
            </div>

            {/* FILTER BUTTONS */}
            <div className="mb-4 flex flex-wrap items-center gap-2 px-4">
                <Button variant={filterStatus === 'all' ? 'default' : 'outline'} onClick={() => handleFilterChange('all')}>
                    All
                </Button>
                <Button
                    variant={filterStatus === 'pending' ? 'default' : 'outline'}
                    onClick={() => handleFilterChange('pending')}
                    className="text-amber-600 dark:text-amber-400"
                >
                    Pending
                </Button>
                <Button
                    variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
                    onClick={() => handleFilterChange('in-progress')}
                    className="text-blue-600 dark:text-blue-400"
                >
                    In Progress
                </Button>
                <Button
                    variant={filterStatus === 'resolved' ? 'default' : 'outline'}
                    onClick={() => handleFilterChange('resolved')}
                    className="text-emerald-600 dark:text-emerald-400"
                >
                    Resolved
                </Button>
            </div>

            {/* Table or Cards */}
            <div className="flex h-full flex-1 flex-col gap-4 p-4 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
                <div className="relative min-h-[50vh] flex-1 rounded-xl border border-sidebar-border/70 dark:border-gray-700">
                    {filteredReports.length > 0 ? (
                        <>
                            {/* Desktop Table */}
                            <div className="relative hidden overflow-x-auto shadow-md sm:rounded-lg lg:block">
                                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3">Disaster Type</th>
                                            <th className="px-6 py-3">Description</th>
                                            <th className="px-6 py-3">Location</th>
                                            <th className="px-6 py-3">Occurred</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Date Reported</th>
                                            <th className="px-6 py-3">Date Resolved</th>
                                            <th className="px-6 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReports.map((disasterReport) => {
                                            const reportedDateTime = formatDateTime(disasterReport.created_at);
                                            const occurredDateTime = formatDateTime(disasterReport.occurred_at);
                                            const resolvedDateTime = disasterReport.resolved_at ? formatDateTime(disasterReport.resolved_at) : null;

                                            return (
                                                <tr
                                                    key={disasterReport.id}
                                                    className="border-b border-gray-200 odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                                                >
                                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                        {disasterReport.disaster_type}
                                                    </td>
                                                    <td className="max-w-xs truncate px-6 py-4">{disasterReport.description}</td>
                                                    <td className="px-6 py-4">{disasterReport.location}</td>
                                                    <td className="px-6 py-4">
                                                        {occurredDateTime.date} <br />
                                                        <span className="text-xs text-gray-500">{occurredDateTime.time}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${getStatusBadge(disasterReport.status).className}`}
                                                        >
                                                            {getStatusBadge(disasterReport.status).icon} {getStatusBadge(disasterReport.status).label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {reportedDateTime.date} <br />
                                                        <span className="text-xs text-gray-500">{reportedDateTime.time}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {resolvedDateTime ? (
                                                            <>
                                                                <span className="text-green-600 dark:text-green-400">{resolvedDateTime.date}</span>
                                                                <br />
                                                                <span className="text-xs text-green-500">{resolvedDateTime.time}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400">Not resolved</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">{renderActionButtons(disasterReport)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                                <div className="text-sm text-slate-600 dark:text-gray-400">
                                    Showing <span className="font-medium text-slate-900 dark:text-white">{filteredReports.length}</span> of{' '}
                                    <span className="font-medium text-slate-900 dark:text-white">{disasterReports.total}</span> reports
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(disasterReports.links[0].url)}
                                        disabled={!disasterReports.links[0].url}
                                        className="flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="ml-1">Previous</span>
                                    </button>

                                    <div className="hidden items-center gap-1 sm:flex">
                                        {disasterReports.links.slice(1, -1).map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(link.url)}
                                                disabled={!link.url}
                                                className={`min-w-[40px] rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(disasterReports.links[disasterReports.links.length - 1].url)}
                                        disabled={!disasterReports.links[disasterReports.links.length - 1].url}
                                        className="flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <span className="mr-1">Next</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-64 items-center justify-center">
                            <div className="text-center">
                                <SquareCheckBig size={48} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-gray-500 dark:text-gray-400">No disaster reports submitted yet.</p>
                                <Link href={route('disaster-reports.create')}>
                                    <Button className="mt-4">Create Your First Report</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
