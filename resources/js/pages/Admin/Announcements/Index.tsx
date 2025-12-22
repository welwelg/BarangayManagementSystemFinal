import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

interface AnnouncementCardProps {
    id: number;
    title: string;
    description: string;
    category: string;
    categoryColor: string;
    meetingDate: string;
    postedDate: string;
}

interface Announcement {
    id: number;
    title: string;
    message: string;
    type: string;
    meeting_date: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface AnnouncementPagination {
    data: Announcement[];
    links: PaginationLink[];
}

function AnnouncementCard({ id, title, description, category, categoryColor, meetingDate, postedDate }: AnnouncementCardProps) {
    return (
        <Card className="flex flex-col border-border bg-card text-card-foreground transition-shadow hover:shadow-lg">
            {' '}
            {/* Added dark mode support */}
            <CardContent className="flex-1 p-4 sm:p-6">
                <div className="mb-4 h-1 w-12 rounded-full bg-primary" />
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <h3 className="mb-3 text-base font-semibold text-card-foreground sm:text-lg">{title}</h3>
                <Badge className={cn('mb-4', categoryColor)}>{category}</Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Meeting Date: {meetingDate}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Posted: {postedDate}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t border-border bg-card p-4 sm:flex-row sm:gap-2">
                {' '}
                {/* Added bg-card for footer */}
                <Link href={route('announcements.edit', id)} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full">
                        Edit
                    </Button>
                </Link>
                <Link
                    href={route('announcements.destroy', id)}
                    method="delete"
                    as="button"
                    className="inline-flex h-9 w-full flex-1 items-center justify-center rounded-md bg-destructive px-3 text-sm font-medium whitespace-nowrap text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" // Destructive styles (already dark mode compatible)
                    onClick={(e) => {
                        if (!confirm('Are you sure you want to delete this?')) {
                            e.preventDefault();
                        }
                    }}
                >
                    Delete
                </Link>
            </CardFooter>
        </Card>
    );
}

// ------------------- Index Page -------------------
const breadcrumbs = [{ title: 'Announcement', href: '/admin/announcements' }];

export default function Index({ announcements }: { announcements: AnnouncementPagination }) {
    const [dateFilter, setDateFilter] = useState('all');

    // Available Filters
    const dateFilters = [
        { label: 'All', value: 'all' },
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 Days', value: 'last7' },
        { label: 'Last 30 Days', value: 'last30' },
    ];

    // Filtering logic
    const filteredAnnouncements = announcements.data.filter((a) => {
        if (!a.meeting_date) return false;

        const meetingDate = new Date(a.meeting_date);
        const today = new Date();
        const diffTime = today.getTime() - meetingDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
            case 'today':
                return meetingDate.toDateString() === today.toDateString();
            case 'yesterday': {
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                return meetingDate.toDateString() === yesterday.toDateString();
            }
            case 'last7':
                return diffDays <= 7;
            case 'last30':
                return diffDays <= 30;
            default:
                return true;
        }
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Announcements" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-background p-4 text-foreground">
                {' '}
                {/* Added bg-background and text-foreground */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-xl font-bold text-foreground sm:text-2xl">Announcement</h1> {/* Added text-foreground */}
                    <Link href={route('announcements.create')}>
                        <Button className="w-full sm:w-auto">Add Announcement</Button>
                    </Link>
                </div>
                <Card className="border-border bg-card text-card-foreground">
                    {' '}
                    {/* Added dark mode support */}
                    <CardContent className="overflow-x-auto p-4 sm:p-6">
                        {/* Date Filter */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {dateFilters.map((filter) => (
                                <Button
                                    key={filter.value}
                                    size="sm"
                                    variant={dateFilter === filter.value ? 'default' : 'outline'}
                                    onClick={() => setDateFilter(filter.value)}
                                    className="text-xs sm:text-sm"
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredAnnouncements.length > 0 ? (
                                filteredAnnouncements.map((a) => (
                                    <AnnouncementCard
                                        key={a.id}
                                        id={a.id}
                                        title={a.title}
                                        description={a.message}
                                        category={a.type}
                                        categoryColor="bg-blue-600 text-white dark:bg-blue-900 dark:text-white" // Enhanced badge for dark mode
                                        meetingDate={
                                            a.meeting_date
                                                ? new Date(a.meeting_date).toLocaleDateString('en-US', {
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric',
                                                  })
                                                : 'Not set'
                                        }
                                        postedDate={new Date(a.created_at).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-sm text-muted-foreground sm:text-base">
                                    {' '}
                                    {/* Changed to text-muted-foreground */}
                                    No announcements found for the selected date.
                                </p>
                            )}
                        </div>
                    </CardContent>
                    {/* Pagination */}
                    <CardFooter className="mt-6 flex justify-center bg-card">
                        {' '}
                        {/* Added bg-card */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {announcements.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`rounded px-3 py-1 text-sm transition-colors ${
                                        link.active
                                            ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-white'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700' // Added dark mode for inactive
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
