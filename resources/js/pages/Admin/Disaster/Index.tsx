import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    CloudRain,
    MapPin,
    MoreVertical,
    Mountain,
    Play,
    Search,
    Waves,
    Wind,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
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
    status: 'pending' | 'in-progress' | 'resolved';
    created_at: string;
    resolved_at: string | null;
    is_new: boolean;
    user: {
        name: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    disasterReports: {
        data: DisasterReport[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    filters: {
        search: string;
        status: string;
    };
    flash?: {
        message?: string;
    };
}

export default function Index() {
    const { disasterReports, filters, flash } = usePage().props as PageProps;
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [selectedTab, setSelectedTab] = useState(filters.status || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleResolve = (id: number) => {
        setProcessingId(id);
        router.post(
            `/admin/disaster-reports/${id}/resolve`,
            {},
            {
                onSuccess: () => {
                    setProcessingId(null);
                },
                onError: () => {
                    setProcessingId(null);
                },
            },
        );
    };

    const getDisasterIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'storm':
                return <CloudRain className="h-5 w-5" />;
            case 'earthquake':
                return <Zap className="h-5 w-5" />;
            case 'landslide':
                return <Mountain className="h-5 w-5" />;
            case 'typhoon':
                return <Wind className="h-5 w-5" />;
            case 'flood':
                return <Waves className="h-5 w-5" />;
            default:
                return <AlertTriangle className="h-5 w-5" />;
        }
    };

    const handleStatusUpdate = (id: number, status: string) => {
        setProcessingId(id);
        router.put(
            `/admin/disaster-reports/${id}`,
            { status },
            {
                onSuccess: () => {
                    setProcessingId(null);
                },
                onError: () => {
                    setProcessingId(null);
                },
            },
        );
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    badge: 'bg-orange-500 hover:bg-orange-600 text-white font-medium',
                    cardClass:
                        'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800',
                };
            case 'in-progress':
                return {
                    badge: 'bg-blue-500 hover:bg-blue-600 text-white font-medium',
                    cardClass:
                        'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800',
                };
            case 'resolved':
                return {
                    badge: 'bg-emerald-500 hover:bg-emerald-600 text-white font-medium',
                    cardClass:
                        'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800',
                };
            default:
                return {
                    badge: 'bg-gray-500 text-white',
                    cardClass: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                };
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleFilterChange = (status: string) => {
        setSelectedTab(status);
        router.get('/admin/disaster-reports', { status: status, search: searchQuery }, { preserveState: true });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        router.get('/admin/disaster-reports', { status: selectedTab, search: query }, { preserveState: true, preserveScroll: true });
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url, { preserveState: true, preserveScroll: true });
        }
    };

    // Calculate stats from all reports (you may want to pass these from backend)
    const stats = {
        total: disasterReports.total,
        pending: disasterReports.data.filter((r) => r.status === 'pending').length,
        inProgress: disasterReports.data.filter((r) => r.status === 'in-progress').length,
        resolved: disasterReports.data.filter((r) => r.status === 'resolved').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Disaster Report" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                {/* Flash Message */}
                {flash?.message && (
                    <div className="mx-4 mt-4 rounded-md bg-green-50 p-4 sm:mx-6 dark:bg-green-900/50">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">{flash.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="border-b border-slate-200/60 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6 dark:border-gray-700 dark:bg-gray-800/80">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-gradient-to-br from-red-500 to-orange-500 p-2 shadow-md">
                                <AlertTriangle className="h-5 w-6 text-white sm:h-6" />
                            </div>
                            <div>
                                <h1 className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl dark:from-red-400 dark:to-orange-400">
                                    Disaster Reports
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-4 sm:p-6">
                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 lg:grid-cols-4">
                        <div className="rounded-lg border border-red-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:p-4 dark:border-red-800/60 dark:bg-gray-800/80">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-2 sm:p-3">
                                    <AlertTriangle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-red-600 sm:text-2xl dark:text-red-400">{stats.total}</p>
                                    <p className="text-xs font-medium text-slate-500 sm:text-sm dark:text-gray-400">Total Reports</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-orange-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:p-4 dark:border-orange-800/60 dark:bg-gray-800/80">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-2 sm:p-3">
                                    <Clock className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-orange-600 sm:text-2xl dark:text-orange-400">{stats.pending}</p>
                                    <p className="text-xs font-medium text-slate-500 sm:text-sm dark:text-gray-400">Pending</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:p-4 dark:border-blue-800/60 dark:bg-gray-800/80">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 p-2 sm:p-3">
                                    <Play className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-blue-600 sm:text-2xl dark:text-blue-400">{stats.inProgress}</p>
                                    <p className="text-xs font-medium text-slate-500 sm:text-sm dark:text-gray-400">In Progress</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-emerald-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:p-4 dark:border-emerald-800/60 dark:bg-gray-800/80">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2 sm:p-3">
                                    <CheckCircle2 className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-emerald-600 sm:text-2xl dark:text-emerald-400">{stats.resolved}</p>
                                    <p className="text-xs font-medium text-slate-500 sm:text-sm dark:text-gray-400">Resolved</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400 dark:text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full rounded-md border border-slate-200 bg-white/80 py-2 pr-4 pl-10 text-sm backdrop-blur-sm focus:ring-2 focus:ring-red-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:focus:ring-red-400"
                                />
                            </div>
                        </div>
                        <div className="flex gap-1 overflow-x-auto rounded-lg bg-white/80 p-1 backdrop-blur-sm dark:bg-gray-800/80">
                            <button
                                onClick={() => handleFilterChange('all')}
                                className={`rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-all sm:px-4 sm:text-sm ${
                                    selectedTab === 'all'
                                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => handleFilterChange('pending')}
                                className={`rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-all sm:px-4 sm:text-sm ${
                                    selectedTab === 'pending'
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => handleFilterChange('in-progress')}
                                className={`rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-all sm:px-4 sm:text-sm ${
                                    selectedTab === 'in-progress'
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => handleFilterChange('resolved')}
                                className={`rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-all sm:px-4 sm:text-sm ${
                                    selectedTab === 'resolved'
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                            >
                                Resolved
                            </button>
                        </div>
                    </div>

                    {/* Reports Grid */}
                    {disasterReports.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                                {disasterReports.data.map((disasterReport) => {
                                    const statusConfig = getStatusConfig(disasterReport.status);
                                    return (
                                        <div
                                            key={disasterReport.id}
                                            className={`${statusConfig.cardClass} rounded-lg border-2 p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:p-6`}
                                        >
                                            {/* Header */}
                                            <div className="mb-3 flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="rounded-lg bg-white/50 p-2 text-slate-700 dark:bg-gray-700/50 dark:text-gray-300">
                                                        {getDisasterIcon(disasterReport.disaster_type)}
                                                    </div>
                                                    <div>
                                                        <h5 className="text-base font-bold tracking-tight text-slate-800 sm:text-lg dark:text-white">
                                                            {disasterReport.disaster_type}
                                                        </h5>
                                                        {disasterReport.is_new && (
                                                            <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                                                NEW
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <button className="rounded-md p-1 hover:bg-white/50 dark:hover:bg-gray-700/50">
                                                        <MoreVertical className="h-4 w-4 text-slate-600 dark:text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Reporter */}
                                            <div className="mb-3 flex items-center space-x-2">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600 dark:bg-gray-700 dark:text-gray-300">
                                                    {disasterReport.user?.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-xs text-slate-600 sm:text-sm dark:text-gray-400">
                                                    Reported by: {disasterReport.user?.name}
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-slate-800 dark:text-gray-200">
                                                    {disasterReport.description.length > 100
                                                        ? `${disasterReport.description.substring(0, 100)}...`
                                                        : disasterReport.description}
                                                </p>
                                                <div className="mt-2 flex items-center space-x-1 text-xs text-slate-600 sm:text-sm dark:text-gray-400">
                                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span>{disasterReport.location}</span>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="mb-4 space-y-2 text-xs text-slate-600 sm:text-sm dark:text-gray-400">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span>Occurred: {formatDateTime(disasterReport.occurred_at)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span>Reported: {formatDateTime(disasterReport.created_at)}</span>
                                                </div>
                                                {disasterReport.resolved_at && (
                                                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span>Resolved: {formatDateTime(disasterReport.resolved_at)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status Badge */}
                                            <div className="mb-4 flex items-center justify-between">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold sm:px-3 ${statusConfig.badge}`}
                                                >
                                                    {disasterReport.status.replace('-', ' ').toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                {disasterReport.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(disasterReport.id, 'in-progress')}
                                                        disabled={processingId === disasterReport.id}
                                                        className="flex flex-1 items-center justify-center space-x-1 rounded-md bg-blue-600 px-2 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
                                                    >
                                                        <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span>{processingId === disasterReport.id ? 'Processing...' : 'Start Progress'}</span>
                                                    </button>
                                                )}

                                                {(disasterReport.status === 'pending' || disasterReport.status === 'in-progress') && (
                                                    <button
                                                        onClick={() => handleResolve(disasterReport.id)}
                                                        disabled={processingId === disasterReport.id}
                                                        className="flex min-w-[100px] items-center justify-center space-x-1 rounded-md bg-emerald-600 px-2 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
                                                    >
                                                        {processingId === disasterReport.id ? (
                                                            <>
                                                                <svg
                                                                    className="h-3 w-3 animate-spin sm:h-4 sm:w-4"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    ></circle>
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                    ></path>
                                                                </svg>
                                                                <span>Resolving...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                <span>Resolve</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {disasterReport.status === 'resolved' && (
                                                    <div className="flex flex-1 items-center justify-center space-x-1 rounded-md bg-emerald-100 px-2 py-2 text-xs font-medium text-emerald-700 sm:px-3 sm:text-sm dark:bg-emerald-900/50 dark:text-emerald-300">
                                                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span>Resolved</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-slate-200/60 bg-white/80 p-4 backdrop-blur-sm sm:flex-row dark:border-gray-700 dark:bg-gray-800/80">
                                <div className="text-sm text-slate-600 dark:text-gray-400">
                                    Showing <span className="font-medium text-slate-900 dark:text-white">{disasterReports.data.length}</span> of{' '}
                                    <span className="font-medium text-slate-900 dark:text-white">{disasterReports.total}</span> reports
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(disasterReports.links[0].url)}
                                        disabled={!disasterReports.links[0].url}
                                        className="flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="ml-1">Previous</span>
                                    </button>

                                    {/* Page Numbers */}
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
                                                } disabled:cursor-not-allowed disabled:opacity-50`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>

                                    {/* Mobile Page Indicator */}
                                    <div className="flex items-center gap-2 sm:hidden">
                                        <span className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            Page {disasterReports.current_page} of {disasterReports.last_page}
                                        </span>
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(disasterReports.links[disasterReports.links.length - 1].url)}
                                        disabled={!disasterReports.links[disasterReports.links.length - 1].url}
                                        className="flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <span className="mr-1">Next</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-gray-600" />
                            <h3 className="mb-2 text-lg font-semibold text-slate-600 dark:text-gray-300">No reports found</h3>
                            <p className="text-slate-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
