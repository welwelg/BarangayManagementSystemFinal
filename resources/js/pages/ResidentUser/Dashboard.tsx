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

export default function Dashboard({ stats = {} }) {
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
    } = stats;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Top Section - Main Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="rounded-2xl border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-bold">Residents</h2>
                                    <p className="text-blue-100">Total registered residents</p>
                                </div>
                                <div className="rounded-xl bg-white/20 p-3">
                                    <Users className="h-20 w-20" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">{total_residents}</span>
                                <span className="ml-2 text-sm text-blue-100">Total</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-bold">Announcements</h2>
                                    <p className="text-emerald-100">Post news & alerts</p>
                                </div>
                                <div className="rounded-xl bg-white/20 p-3">
                                    <Megaphone className="h-20 w-20" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">{total_announcements}</span>
                                <span className="ml-2 text-sm text-emerald-100">Published</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-bold">Complaints</h2>
                                    <p className="text-orange-100">Track and resolve issues</p>
                                </div>
                                <div className="rounded-xl bg-white/20 p-3">
                                    <MessageSquareWarning className="h-20 w-20" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">{pending_complaints}</span>
                                <span className="ml-2 text-sm text-orange-100">Pending</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-0 bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-bold">Disaster Reports</h2>
                                    <p className="text-red-100">Emergency incidents</p>
                                </div>
                                <div className="rounded-xl bg-white/20 p-3">
                                    <AlertTriangle className="h-20 w-20" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">{pending_disaster_reports}</span>
                                <span className="ml-2 text-sm text-red-100">Pending</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Resident Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-blue-500" />
                                <span className="text-sm text-gray-600">Male Residents</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-2xl font-bold text-blue-500">{male_residents}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <UserX className="h-5 w-5 text-pink-500" />
                                <span className="text-sm text-gray-600">Female Residents</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-2xl font-bold text-pink-500">{female_residents}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-600">Average Age</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-2xl font-bold text-green-500">{average_age}</span>
                                <span className="ml-1 text-sm text-gray-400">years</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-purple-500" />
                                <span className="text-sm text-gray-600">Total Zones</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-2xl font-bold text-purple-500">{stats.total_zones ?? 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section - Zone Distribution and Recent Activities */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Zone Distribution */}
                    <Card className="rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Residents by Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(residents_by_zone).length > 0 ? (
                                <div className="space-y-3">
                                    {Object.entries(residents_by_zone).map(([zone, count]) => (
                                        <div key={zone} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                            <div>
                                                <p className="font-semibold text-blue-600">{zone}</p>
                                                <p className="text-sm text-gray-500">Zone residents</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-blue-600">{count}</span>
                                                <p className="text-xs text-gray-400">
                                                    {total_residents > 0 ? Math.round((count / total_residents) * 100) : 0}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center text-gray-400">
                                    <p>No zone data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Latest Announcements */}
                    <Card className="rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Megaphone className="h-5 w-5" />
                                Latest Announcements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.latest_announcements && stats.latest_announcements.length > 0 ? (
                                <div className="space-y-3">
                                    {stats.latest_announcements.slice(0, 5).map((announcement) => (
                                        <div key={announcement.id} className="rounded-lg bg-gray-50 p-3 shadow-sm transition hover:shadow-md">
                                            <h3 className="font-semibold text-blue-600">{announcement.title}</h3>
                                            <p className="truncate text-sm text-gray-600">{announcement.message}</p>
                                            <p className="mt-1 text-xs text-gray-400">
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
                                    <p>No announcements available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <NotebookPen className="h-5 w-5" />
                                Recent Activities
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_activities.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_activities.map((activity, index) => (
                                        <div key={index} className="rounded-lg bg-gray-50 p-3">
                                            <p className="font-semibold text-blue-600">{activity.title}</p>
                                            <p className="truncate text-sm text-gray-500">{activity.description}</p>
                                            <span className="text-xs text-gray-400">{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-32 items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <p className="text-lg">No recent activities</p>
                                        <p className="text-sm">Activities will appear here once you start managing your barangay</p>
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
