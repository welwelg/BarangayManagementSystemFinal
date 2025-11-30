import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { IconAlertTriangle } from '@tabler/icons-react';


interface Blotter {
    id: number;
    user_id: number;
    type: string;
    description: string;
    respondent_user_id: number | null;
    respondent_name: string | null;
    status: 'pending' | 'approved' | 'rejected';
    scheduled_at: string | null;
    admin_notes: string | null;
    approved_by: number | null;
    created_at: string;
    updated_at: string;
}

interface BlotterIndexProps {
    blotters: {
        data: Blotter[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}


const STATUS_CONFIG = {
    pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100', label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100', label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100', label: 'Rejected' },
} as const;

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Blotter', href: '/user/blotter' }];

export default function Index({ blotters }: BlotterIndexProps) {

    const hasReports = blotters?.data?.length > 0;

    {/*DATE FORMATTING*/}
    const formatDateTime = (isoString: string | null) => {
        if (!isoString) return { date: '', time: '' };
        try {
            const date = new Date(isoString);
            return {
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
        } catch  {
            return { date: 'Invalid Date', time: '' };
        }
    };

    {/* EMPTY STATE/STATUS*/}
    const EmptyBlotterState = (
        <Empty className="py-20">
            <EmptyHeader>
                <EmptyMedia variant="icon" className="text-primary">
                    <IconAlertTriangle size={48} />
                </EmptyMedia>
                <EmptyTitle>No Blotter Reports Yet</EmptyTitle>
                <EmptyDescription>You haven&apos;t filed any blotter reports. Click the button below to submit your first blotter.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Link href={route('residentuser.blotter.create')}>
                    <Button>File New Report</Button>
                </Link>
            </EmptyContent>
        </Empty>
    );

   {/*BADGE STATUS*/}
    const getStatusBadge = (status: Blotter['status']) => {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${config.color}`}>
                {config.label}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blotter" />

            <div className="relative m-4 overflow-x-auto bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                {' '}
                {/* Added bg for consistency */}
                {hasReports ? (
                    <>
                        {/* Header */}
                        <div className="m-4 flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Blotter</h1>
                            <Link href={route('residentuser.blotter.create')}>
                                <Button variant="default" className="hover:bg-primary/90">
                                    {' '}
                                    Request Blotter
                                </Button>
                            </Link>
                        </div>

                        {/* Table */}
                        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Respondent</th>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date & Time Filed</th>
                                    <th className="px-6 py-3">Scheduled Hearing/Date</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blotters.data.map((blotter) => {
                                    const created = formatDateTime(blotter.created_at);
                                    const scheduled = formatDateTime(blotter.scheduled_at);

                                    return (
                                        <tr
                                            key={blotter.id}
                                            className="border-b hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 capitalize dark:text-white">{blotter.type}</td>
                                            <td className="px-6 py-4">{blotter.respondent_name ?? 'N/A'}</td>
                                            <td className="max-w-xs truncate px-6 py-4">{blotter.description}</td>
                                            <td className="px-6 py-4">{getStatusBadge(blotter.status)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{created.date}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{created.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{scheduled.date || '—'}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{scheduled.time || ''}</span>
                                                </div>
                                            </td>
                                            <td className="flex gap-2 px-6 py-4">
                                                <Link href={route('residentuser.blotter.show', blotter.id)}>
                                                    <Button size="sm" variant="outline">
                                                        View
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="p-4">
                            <Pagination>
                                <PaginationContent>
                                    {/* Previous */}
                                    <PaginationItem>
                                        {blotters.prev_page_url ? (
                                            <Link href={blotters.prev_page_url}>
                                                <PaginationPrevious size="sm" />
                                            </Link>
                                        ) : (
                                            <PaginationPrevious size="sm" className="pointer-events-none opacity-50" />
                                        )}
                                    </PaginationItem>

                                    {/* Page numbers */}
                                    {blotters.links
                                        .filter((link) => !link.label.includes('&laquo;') && !link.label.includes('&raquo;'))
                                        .map((link, idx) => (
                                            <PaginationItem key={idx}>
                                                {link.url ? (
                                                    <Link href={link.url}>
                                                        <PaginationLink size="sm" isActive={link.active}>
                                                            {link.label}
                                                        </PaginationLink>
                                                    </Link>
                                                ) : (
                                                    <PaginationLink size="sm" className="pointer-events-none opacity-50">
                                                        {link.label}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ))}

                                    {/* Next */}
                                    <PaginationItem>
                                        {blotters.next_page_url ? (
                                            <Link href={blotters.next_page_url}>
                                                <PaginationNext size="sm" />
                                            </Link>
                                        ) : (
                                            <PaginationNext size="sm" className="pointer-events-none opacity-50" />
                                        )}
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                ) : (
                    // Empty State
                    <div className="p-8">{EmptyBlotterState}</div>
                )}
            </div>
        </AppLayout>
    );
}
