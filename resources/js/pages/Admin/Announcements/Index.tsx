import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, SquareCheckBig } from 'lucide-react';
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

function AnnouncementCard({ id, title, description, category, categoryColor, meetingDate, postedDate }: AnnouncementCardProps) {
    return (
        <Card className="flex flex-col transition-shadow hover:shadow-lg">
            <CardContent className="flex-1 p-6">
                <div className="mb-4 h-1 w-12 rounded-full bg-primary" />

                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

                <h3 className="mb-3 text-lg font-semibold text-card-foreground">{title}</h3>

                <Badge className={cn('mb-4', categoryColor)}>{category}</Badge>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Meeting Date: {meetingDate}</span>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">Posted: {postedDate}</p>
            </CardContent>

            <CardFooter className="flex gap-2 border-t border-border p-4">
                <Link href={route('announcements.edit', id)}>
                    <Button variant="ghost" size="sm" className="flex-1">
                        Edit
                    </Button>
                </Link>
                <Link
                    href={route('announcements.destroy', id)}
                    method="delete"
                    as="button"
                    onClick={(e) => {
                        if (!confirm('Are you sure you want to delete this?')) {
                            e.preventDefault();
                        }
                    }}
                >
                    <Button variant="destructive" size="sm" className="flex-1">
                        Delete
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}

// ------------------- Index Page -------------------
const breadcrumbs = [{ title: 'Announcement', href: '/admin/announcements' }];

export default function Index({ announcements = [] }) {
    const { flash } = usePage().props;
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

            {/* Success Message */}
            <div className="m-4">
                {flash.message && (
                    <Alert>
                        <SquareCheckBig />
                        <AlertTitle>Notification!</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Announcement</h1>
                    <Link href={route('announcements.create')}>
                        <Button>Add Announcement</Button>
                    </Link>
                </div>

                <Card>
                    <CardContent className="overflow-x-auto p-6">
                        {/* Date Filter */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {dateFilters.map((filter) => (
                                <Button
                                    key={filter.value}
                                    size="sm"
                                    variant={dateFilter === filter.value ? 'default' : 'outline'}
                                    onClick={() => setDateFilter(filter.value)}
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredAnnouncements.length > 0 ? (
                                filteredAnnouncements.map((a) => (
                                    <AnnouncementCard
                                        key={a.id}
                                        id={a.id}
                                        title={a.title}
                                        description={a.message}
                                        category={a.type}
                                        categoryColor="bg-blue-600 text-white dark:bg-blue-900"
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
                                <p className="text-center text-gray-500">No announcements found for the selected date.</p>
                            )}
                        </div>
                    </CardContent>

                    {/* Pagination */}
                    <CardFooter className="mt-6 flex justify-center">
                        <div className="flex gap-2">
                            {announcements.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`rounded px-3 py-1 ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
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
