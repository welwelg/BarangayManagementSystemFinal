import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Announcements',
        href: '/residentuser/announcements',
    },
];

export default function Index({ announcements }) {
    const [filter, setFilter] = useState('all');

    const filteredAnnouncements = announcements.data.filter((announcement) => {
        const createdDate = new Date(announcement.created_at);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (filter) {
            case 'today':
                return diffDays === 0;
            case 'yesterday':
                return diffDays === 1;
            case 'last5days':
                return diffDays <= 5;
            case 'last30days':
                return diffDays <= 30;
            default:
                return true;
        }
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcement" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Announcement</h1>

                    {/* Modern Date Filter */}
                    <div className="flex items-center gap-2">
                        <Select onValueChange={setFilter} defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="yesterday">Yesterday</SelectItem>
                                <SelectItem value="last5days">Last 5 Days</SelectItem>
                                <SelectItem value="last30days">Last 30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Announcements List */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="p-6">
                        {filteredAnnouncements && filteredAnnouncements.length > 0 ? (
                            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredAnnouncements.map((announcement) => {
                                    const createdDate = new Date(announcement.created_at);
                                    const today = new Date();
                                    const diffDays = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

                                    const isRead = announcement.is_read || false;

                                    let meetingDatePassed = false;
                                    if (announcement.meeting_date) {
                                        const meetingDate = new Date(announcement.meeting_date);
                                        meetingDate.setHours(23, 59, 59, 999);
                                        meetingDatePassed = today > meetingDate;
                                    }

                                    const isNew = !isRead && !meetingDatePassed;

                                    return (
                                        <div
                                            key={announcement.id}
                                            className={`relative block max-w-sm transform rounded-lg border p-6 shadow-sm transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl ${
                                                isNew
                                                    ? 'border-green-400 bg-gradient-to-r from-green-50 to-green-100 hover:border-green-500 hover:from-green-100 hover:to-green-200 dark:border-green-500 dark:from-green-900 dark:to-green-800 dark:hover:from-green-800 dark:hover:to-green-700'
                                                    : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:from-blue-900 dark:hover:to-blue-800'
                                            }`}
                                        >
                                            {/*  "New" Badge */}
                                            {isNew && (
                                                <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-md">
                                                    NEW
                                                </span>
                                            )}

                                            <div className="mb-2 flex items-start justify-between">
                                                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                    {announcement.title}
                                                </h5>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs ${
                                                        announcement.type === 'urgent'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                    }`}
                                                >
                                                    {announcement.type}
                                                </span>
                                            </div>

                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                                {announcement.message.length > 100
                                                    ? `${announcement.message.substring(0, 100)}...`
                                                    : announcement.message}
                                            </p>

                                            {announcement.meeting_date && (
                                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                                    📅 Meeting Date:{' '}
                                                    {new Date(announcement.meeting_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            )}

                                            <time className="block text-xs text-gray-400">
                                                Posted:{' '}
                                                {new Date(announcement.created_at).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </time>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="mb-4 text-lg text-gray-400">📢</div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No announcements found</h3>
                                <p className="text-gray-500 dark:text-gray-400">Try adjusting the date filter.</p>
                            </div>
                        )}
                    </div>
                    {/* Pagination Section */}
                    <div className="mt-6 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                {announcements.links.map((link, index) => {
                                    if (link.label.includes('Previous'))
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationPrevious href={link.url || '#'} disabled={!link.url} />
                                            </PaginationItem>
                                        );

                                    if (link.label.includes('Next'))
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationNext href={link.url || '#'} disabled={!link.url} />
                                            </PaginationItem>
                                        );

                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                href={link.url || '#'}
                                                isActive={link.active}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
