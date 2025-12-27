import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AlertTriangle, Calendar, MapPin, Megaphone, MessageSquareWarning, NotebookPen, UserCheck, Users, UserX } from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

interface Announcement {
    id: number;
    title: string;
    message: string;
    meeting_date: string;
}

interface Activity {
    title: string;
    description: string;
    time: string;
}

interface Stats {
    total_residents: number;
    male_residents: number;
    female_residents: number;
    residents_by_zone: Record<string, number>;
    average_age: number;
    total_announcements: number;
    pending_complaints: number;
    pending_disaster_reports: number;
    recent_activities: Activity[];
    total_zones: number;
    latest_announcements: Announcement[];
}

interface DashboardProps {
    stats?: Partial<Stats>;
}

export default function Dashboard({ stats = {} }: DashboardProps) {
    const {
        total_residents = 0,
        male_residents = 0,
        female_residents = 0,
        residents_by_zone = {},
        average_age = 0,
        total_announcements = 0,
        pending_complaints = 0,
        pending_disaster_reports = 0,
        recent_activities = [],
        total_zones = 0,
        latest_announcements = [],
    } = stats;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-white p-4 dark:bg-gray-950">
                {/* Top Section - Main Stats Cards */}
                {/* Top Section - Main Stats Cards */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
    {/* 1. RESIDENTS CARD */}
    <Card className="rounded-2xl border-0 bg-linear-to-br from-sky-500 to-sky-600 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
        <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4"> {/* Changed to justify-between for better spacing */}
                <div className="min-w-0 flex-1"> {/* Added min-w-0 to allow text truncation if needed */}
                    <h2 className="text-base font-bold sm:text-lg truncate">Residents</h2>
                    <p className="text-xs text-blue-100 sm:text-sm truncate">Total registered residents</p>
                </div>
                {/* Responsive Icon Container */}
                <div className="shrink-0 rounded-xl bg-white/20 p-2 sm:p-3">
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
                </div>
            </div>
            <div className="mt-4">
                <span className="text-2xl font-bold sm:text-3xl lg:text-4xl">{total_residents}</span>
                <span className="ml-2 text-xs text-blue-100 sm:text-sm">Total</span>
            </div>
        </CardContent>
    </Card>

    {/* 2. ANNOUNCEMENTS CARD (THE FIX) */}
    <Card className="rounded-2xl border-0 bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
        <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold sm:text-lg truncate">Announcements</h2>
                    <p className="text-xs text-emerald-100 sm:text-sm truncate">Post news & alerts</p>
                </div>
                {/* Responsive Icon: flex-shrink-0 prevents squashing, sizes adjusted */}
                <div className="shrink-0 rounded-xl bg-white/20 p-2 sm:p-3">
                    <Megaphone className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
                </div>
            </div>
            <div className="mt-4">
                <span className="text-2xl font-bold sm:text-3xl lg:text-4xl">{total_announcements}</span>
                <span className="ml-2 text-xs text-emerald-100 sm:text-sm">Published</span>
            </div>
        </CardContent>
    </Card>

    {/* 3. COMPLAINTS CARD */}
    <Card className="rounded-2xl border-0 bg-linear-to-br from-orange-500 to-amber-600 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
        <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold sm:text-lg truncate">Complaints</h2>
                    <p className="text-xs text-orange-100 sm:text-sm truncate">Track and resolve</p>
                </div>
                <div className="shrink-0 rounded-xl bg-white/20 p-2 sm:p-3">
                    <MessageSquareWarning className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
                </div>
            </div>
            <div className="mt-4">
                <span className="text-2xl font-bold sm:text-3xl lg:text-4xl">{pending_complaints}</span>
                <span className="ml-2 text-xs text-orange-100 sm:text-sm">Pending</span>
            </div>
        </CardContent>
    </Card>

    {/* 4. DISASTER REPORTS CARD */}
    <Card className="rounded-2xl border-0 bg-linear-to-br from-red-500 to-pink-600 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
        <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold sm:text-lg truncate">Disasters</h2>
                    <p className="text-xs text-red-100 sm:text-sm truncate">Emergency incidents</p>
                </div>
                <div className="shrink-0 rounded-xl bg-white/20 p-2 sm:p-3">
                    <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
                </div>
            </div>
            <div className="mt-4">
                <span className="text-2xl font-bold sm:text-3xl lg:text-4xl">{pending_disaster_reports}</span>
                <span className="ml-2 text-xs text-red-100 sm:text-sm">Pending</span>
            </div>
        </CardContent>
    </Card>
</div>

                {/* Detailed Resident Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {' '}
                    {/* Responsive: 1 col mobile, 2 sm, 4 md+ */}
                    <Card className="border border-sky-300 bg-linear-to-r from-sky-100 to-sky-300 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg dark:border-sky-800 dark:from-sky-700 dark:to-sky-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-sky-900 dark:text-white" />
                                <span className="text-sm text-sky-900 dark:text-white">Male Residents</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl font-bold text-sky-950 sm:text-2xl dark:text-white">{male_residents}</span>{' '}
                                {/* Smaller on mobile */}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border border-pink-300 bg-linear-to-r from-pink-100 to-pink-300 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg dark:border-pink-800 dark:from-pink-700 dark:to-pink-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <UserX className="h-5 w-5 text-pink-500 dark:text-white" />
                                <span className="text-sm text-gray-600 dark:text-white">Female Residents</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl font-bold text-pink-500 sm:text-2xl dark:text-white">{female_residents}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border border-green-300 bg-linear-to-r from-green-100 to-green-300 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg dark:border-green-800 dark:from-green-700 dark:to-green-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-green-500 dark:text-white" />
                                <span className="text-sm text-gray-600 dark:text-white">Average Age</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl font-bold text-green-500 sm:text-2xl dark:text-white">{average_age}</span>
                                <span className="ml-1 text-xs text-gray-400 sm:text-sm dark:text-white">years</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border border-purple-300 bg-linear-to-r from-purple-100 to-purple-300 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg dark:border-purple-800 dark:from-purple-700 dark:to-purple-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-purple-500 dark:text-white" />
                                <span className="text-sm text-gray-600 dark:text-white">Total Zones</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl font-bold text-purple-500 sm:text-2xl dark:text-white">{total_zones}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section - Zone Distribution and Recent Activities */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {' '}
                    {/* Responsive: 1 col mobile, 3 md+ */}
                    {/* Zone Distribution */}
                    <Card className="rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                {' '}
                                {/* Smaller on mobile */}
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                                Residents by Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(residents_by_zone).length > 0 ? (
                                <div className="space-y-3">
                                    {Object.entries(residents_by_zone).map(([zone, count]) => (
                                        <div
                                            key={zone}
                                            className="flex items-center justify-between rounded-lg bg-sky-200 p-3 shadow-sm transition hover:shadow-md dark:bg-sky-950"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-sky-950 sm:text-base dark:text-white">{zone}</p>{' '}
                                                {/* Smaller on mobile */}
                                                <p className="text-xs text-sky-900 sm:text-sm dark:text-white">Zone residents</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-sky-950 sm:text-xl dark:text-white">{count as number}</span>
                                                <p className="text-xs text-sky-900 dark:text-white">
                                                    {total_residents > 0 ? Math.round(((count as number) / total_residents) * 100) : 0}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center text-gray-400">
                                    <p className="text-sm sm:text-base">No zone data available</p> {/* Smaller on mobile */}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    {/* Latest Announcements */}
                    <Card className="rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />
                                Latest Announcements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latest_announcements.length > 0 ? (
                                <div className="space-y-3">
                                    {latest_announcements.slice(0, 5).map((announcement: Announcement) => (
                                        <div
                                            key={announcement.id}
                                            className="rounded-lg bg-sky-200 p-3 shadow-sm transition hover:shadow-md dark:bg-sky-950"
                                        >
                                            <h3 className="text-sm font-semibold text-sky-950 sm:text-base dark:text-white">{announcement.title}</h3>
                                            <p className="truncate text-xs text-sky-900 sm:text-sm dark:text-white">{announcement.message}</p>
                                            <p className="mt-1 text-xs text-sky-800 dark:text-white">
                                                📅{' '}
                                                {new Date(announcement.meeting_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center text-gray-400">
                                    <p className="text-sm sm:text-base">No announcements available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    {/* Recent Activities */}
                    <Card className="rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <NotebookPen className="h-4 w-4 sm:h-5 sm:w-5" />
                                Recent Activities
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_activities.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_activities.map((activity: Activity, index: number) => (
                                        <div key={index} className="rounded-lg bg-sky-200 p-3 shadow-sm transition hover:shadow-md dark:bg-sky-950">
                                            <p className="text-sm font-semibold text-sky-950 sm:text-base dark:text-white">{activity.title}</p>
                                            <p className="truncate text-xs text-sky-900 sm:text-sm dark:text-white">{activity.description}</p>
                                            <span className="text-xs text-sky-800 dark:text-white">{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <p className="text-base sm:text-lg">No recent activities</p>
                                        <p className="text-xs sm:text-sm">Activities will appear here once you start managing your barangay</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
