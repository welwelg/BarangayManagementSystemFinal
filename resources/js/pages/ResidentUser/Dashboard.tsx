import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AlertTriangle, Calendar, MapPin, Megaphone, MessageSquareWarning, NotebookPen, UserCheck, Users, UserX } from 'lucide-react';

const breadcrumbs = [
    {
        title: 'User Dashboard',
        href: '/residentuser/dashboard',
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
            <Head title="Resident Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-3 overflow-x-auto rounded-xl bg-white p-2 sm:gap-4 sm:p-4 dark:bg-gray-950">
                {/* Top Section - Main Stats Cards */}
                <div className="xs:grid-cols-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
                    {/* Residents Card */}
                    <Card className="rounded-lg border-0 bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-xl sm:shadow-lg sm:hover:-translate-y-2 md:rounded-2xl">
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1 pr-2">
                                        <h2 className="text-sm leading-tight font-bold sm:text-base md:text-lg">Residents</h2>
                                        <p className="mt-0.5 text-[10px] leading-tight text-blue-100 sm:text-xs md:text-sm">Total registered</p>
                                    </div>
                                    <div className="flex-shrink-0 rounded-lg bg-white/20 p-1.5 sm:p-2 md:p-3">
                                        <Users className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold sm:text-3xl md:text-4xl">{total_residents}</span>
                                    <span className="ml-1 text-[10px] text-blue-100 sm:ml-2 sm:text-xs md:text-sm">Total</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Announcements Card */}
                    <Card className="rounded-lg border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-xl sm:shadow-lg sm:hover:-translate-y-2 md:rounded-2xl">
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1 pr-2">
                                        <h2 className="text-sm leading-tight font-bold sm:text-base md:text-lg">Announcements</h2>
                                        <p className="mt-0.5 text-[10px] leading-tight text-emerald-100 sm:text-xs md:text-sm">Post news & alerts</p>
                                    </div>
                                    <div className="flex-shrink-0 rounded-lg bg-white/20 p-1.5 sm:p-2 md:p-3">
                                        <Megaphone className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold sm:text-3xl md:text-4xl">{total_announcements}</span>
                                    <span className="ml-1 text-[10px] text-emerald-100 sm:ml-2 sm:text-xs md:text-sm">Published</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Complaints Card */}
                    <Card className="rounded-lg border-0 bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-xl sm:shadow-lg sm:hover:-translate-y-2 md:rounded-2xl">
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1 pr-2">
                                        <h2 className="text-sm leading-tight font-bold sm:text-base md:text-lg">Complaints</h2>
                                        <p className="mt-0.5 text-[10px] leading-tight text-orange-100 sm:text-xs md:text-sm">Track issues</p>
                                    </div>
                                    <div className="flex-shrink-0 rounded-lg bg-white/20 p-1.5 sm:p-2 md:p-3">
                                        <MessageSquareWarning className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold sm:text-3xl md:text-4xl">{pending_complaints}</span>
                                    <span className="ml-1 text-[10px] text-orange-100 sm:ml-2 sm:text-xs md:text-sm">Pending</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Disaster Reports Card */}
                    <Card className="rounded-lg border-0 bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-xl sm:shadow-lg sm:hover:-translate-y-2 md:rounded-2xl">
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1 pr-2">
                                        <h2 className="text-sm leading-tight font-bold sm:text-base md:text-lg">Disaster Reports</h2>
                                        <p className="mt-0.5 text-[10px] leading-tight text-red-100 sm:text-xs md:text-sm">Emergency</p>
                                    </div>
                                    <div className="flex-shrink-0 rounded-lg bg-white/20 p-1.5 sm:p-2 md:p-3">
                                        <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold sm:text-3xl md:text-4xl">{pending_disaster_reports}</span>
                                    <span className="ml-1 text-[10px] text-red-100 sm:ml-2 sm:text-xs md:text-sm">Pending</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Resident Stats */}
                <div className="xs:grid-cols-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
                    <Card className="rounded-lg border-1 border-sky-300 bg-gradient-to-r from-sky-100 to-sky-300 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-xl sm:shadow-md sm:hover:-translate-y-2 dark:border-sky-800 dark:from-sky-700 dark:to-sky-900">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 flex-shrink-0 text-sky-900 sm:h-5 sm:w-5 dark:text-white" />
                                <span className="truncate text-xs text-sky-900 sm:text-sm dark:text-white">Male Residents</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl font-bold sm:text-2xl dark:text-white">{male_residents}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-1 border-pink-300 bg-gradient-to-r from-pink-100 to-pink-300 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-xl sm:shadow-md sm:hover:-translate-y-2 dark:border-pink-800 dark:from-pink-700 dark:to-pink-900">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2">
                                <UserX className="h-4 w-4 flex-shrink-0 text-pink-500 sm:h-5 sm:w-5 dark:text-white" />
                                <span className="truncate text-xs text-gray-600 sm:text-sm dark:text-white">Female Residents</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl font-bold text-pink-500 sm:text-2xl dark:text-white">{female_residents}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-1 border-green-300 bg-gradient-to-r from-green-100 to-green-300 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-xl sm:shadow-md sm:hover:-translate-y-2 dark:border-green-800 dark:from-green-700 dark:to-green-900">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 flex-shrink-0 text-green-500 sm:h-5 sm:w-5 dark:text-white" />
                                <span className="truncate text-xs text-gray-600 sm:text-sm dark:text-white">Average Age</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl font-bold text-green-500 sm:text-2xl dark:text-white">{average_age}</span>
                                <span className="ml-1 text-xs text-gray-400 sm:text-sm dark:text-white">yrs</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-1 border-purple-300 bg-gradient-to-r from-purple-100 to-purple-300 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-xl sm:shadow-md sm:hover:-translate-y-2 dark:border-purple-800 dark:from-purple-700 dark:to-purple-900">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 flex-shrink-0 text-purple-500 sm:h-5 sm:w-5 dark:text-white" />
                                <span className="truncate text-xs text-gray-600 sm:text-sm dark:text-white">Total Zones</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-xl font-bold text-purple-500 sm:text-2xl dark:text-white">{total_zones}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section - Zone Distribution and Recent Activities */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-4 lg:grid-cols-3">
                    {/* Zone Distribution */}
                    <Card className="rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-xl sm:hover:-translate-y-2 sm:hover:shadow-lg md:rounded-2xl">
                        <CardHeader className="pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                                <MapPin className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                                <span className="truncate">Residents by Zone</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(residents_by_zone).length > 0 ? (
                                <div className="space-y-2 sm:space-y-3">
                                    {Object.entries(residents_by_zone).map(([zone, count]) => (
                                        <div
                                            key={zone}
                                            className="flex items-center justify-between rounded-lg bg-sky-200 p-2 shadow-sm transition hover:shadow-md sm:p-3 dark:bg-sky-950"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-semibold text-sky-950 sm:text-sm dark:text-white">{zone}</p>
                                                <p className="text-[10px] text-sky-900 sm:text-xs dark:text-white">Zone residents</p>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 text-right">
                                                <span className="text-lg font-bold text-sky-950 sm:text-xl dark:text-white">{count as number}</span>
                                                <p className="text-[10px] text-sky-900 sm:text-xs dark:text-white">
                                                    {total_residents > 0 ? Math.round(((count as number) / total_residents) * 100) : 0}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-24 items-center justify-center text-gray-400 sm:h-32">
                                    <p className="text-center text-xs sm:text-sm">No zone data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Latest Announcements */}
                    <Card className="rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-xl sm:hover:-translate-y-2 sm:hover:shadow-lg md:rounded-2xl">
                        <CardHeader className="pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                                <Megaphone className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                                <span className="truncate">Latest Announcements</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latest_announcements.length > 0 ? (
                                <div className="space-y-2 sm:space-y-3">
                                    {latest_announcements.slice(0, 5).map((announcement: Announcement) => (
                                        <div
                                            key={announcement.id}
                                            className="rounded-lg bg-sky-200 p-2 shadow-sm transition hover:shadow-md sm:p-3 dark:bg-sky-950"
                                        >
                                            <h3 className="truncate text-xs font-semibold text-sky-950 sm:text-sm dark:text-white">
                                                {announcement.title}
                                            </h3>
                                            <p className="mt-0.5 line-clamp-2 text-[10px] text-sky-900 sm:text-xs dark:text-white">
                                                {announcement.message}
                                            </p>
                                            <p className="mt-1 text-[10px] text-sky-800 sm:text-xs dark:text-white">
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
                                <div className="flex h-24 items-center justify-center text-gray-400 sm:h-32">
                                    <p className="text-center text-xs sm:text-sm">No announcements available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-xl sm:hover:-translate-y-2 sm:hover:shadow-lg md:rounded-2xl">
                        <CardHeader className="pb-3 sm:pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
                                <NotebookPen className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                                <span className="truncate">Recent Activities</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_activities.length > 0 ? (
                                <div className="space-y-2 sm:space-y-3">
                                    {recent_activities.map((activity: Activity, index: number) => (
                                        <div
                                            key={index}
                                            className="rounded-lg bg-sky-200 p-2 shadow-sm transition hover:shadow-md sm:p-3 dark:bg-sky-950"
                                        >
                                            <p className="truncate text-xs font-semibold text-sky-950 sm:text-sm dark:text-white">{activity.title}</p>
                                            <p className="mt-0.5 line-clamp-2 text-[10px] text-sky-900 sm:text-xs dark:text-white">
                                                {activity.description}
                                            </p>
                                            <span className="text-[10px] text-sky-800 sm:text-xs dark:text-white">{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-24 items-center justify-center text-gray-400 sm:h-32">
                                    <div className="px-2 text-center">
                                        <p className="text-xs font-medium sm:text-base">No recent activities</p>
                                        <p className="text-[10px] sm:text-xs">Activities will appear once you manage your barangay</p>
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
