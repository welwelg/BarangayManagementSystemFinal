import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from "@/components/ui/spinner";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { IconAlertTriangle, IconCalendar, IconClock, IconFileText, IconUser, IconFiles, IconChecklist, IconChecks } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Blotter {
    id: number;
    user_id: number;
    type: string;
    description: string;
    respondent_user_id: number | null;
    respondent_name: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'settled';
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
    stats: {
        total: number;
        pending: number;
        resolved: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Blotter Records', href: '/user/blotter' }];

export default function Index({ blotters, stats }: BlotterIndexProps) {

    const hasReports = blotters?.data?.length > 0;

    const formatDateTime = (isoString: string | null) => {
        if (!isoString) return { date: '—', time: '' };
        try {
            const date = new Date(isoString);
            return {
                date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
        } catch {
            return { date: 'Invalid', time: '' };
        }
    };

    // STATUS BADGE COMPONENT
    const StatusBadge = ({ blotter }: { blotter: Blotter }) => {
        if (blotter.status === 'settled') {
            return (
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                    Case Closed
                </Badge>
            );
        }
        if (blotter.status === 'approved' && blotter.scheduled_at && new Date(blotter.scheduled_at) < new Date()) {
            return (
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100">
                    Awaiting Result
                </Badge>
            );
        }
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
            approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
            rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        };
        const style = styles[blotter.status as keyof typeof styles] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";

        return (
            <Badge variant="outline" className={`font-medium capitalize ${style}`}>
                {blotter.status === 'pending' && <Spinner className="mr-2 h-3 w-3" />}
                {blotter.status}
            </Badge>
        );
    };

    const handleDelete = (id: number) => {
        toast("Delete this report?", {
            description: "This action cannot be undone.",
            action: {
                label: "Confirm",
                onClick: () => {
                    router.delete(route('residentuser.blotter.destroy', id), {
                        onSuccess: () => toast.success("Report deleted successfully")
                    });
                },
            },
            cancel: { label: "Cancel", onClick: () => toast.dismiss() },
        });
    };

    const EmptyBlotterState = (
        <Empty className="py-20">
            <EmptyHeader>
                <EmptyMedia variant="icon" className="text-muted-foreground">
                    <IconAlertTriangle size={48} />
                </EmptyMedia>
                <EmptyTitle>No Blotter Reports Found</EmptyTitle>
                <EmptyDescription>You have not filed any complaints yet. If you need assistance, click below to file a report.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Link href={route('residentuser.blotter.create')}>
                    <Button className="gap-2">
                         File New Report
                    </Button>
                </Link>
            </EmptyContent>
        </Empty>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Blotter Reports" />

            <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-background py-6 sm:py-10">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* --- HEADER --- */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Blotter Records</h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                View and track the status of your filed complaints.
                            </p>
                        </div>
                        {hasReports && (
                            <Link href={route('residentuser.blotter.create')}>
                                <Button className="w-full sm:w-auto gap-2 shadow-sm">
                                    File Report
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* --- STATS CARDS (Responsive Grid) --- */}
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                        <Card className="shadow-sm border-l-4 border-l-blue-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Filed</CardTitle>
                                <IconFiles className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <p className="text-xs text-muted-foreground">Lifetime complaints filed</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-l-4 border-l-yellow-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                                <IconChecklist className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{stats.pending}</div>
                                <p className="text-xs text-muted-foreground">Awaiting admin action</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-l-4 border-l-green-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Resolved / Settled</CardTitle>
                                <IconChecks className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.resolved}</div>
                                <p className="text-xs text-muted-foreground">Succesfully closed cases</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    {hasReports ? (
                        <>
                            {/* Desktop View (Table) */}
                            <Card className="hidden md:block overflow-hidden border bg-card text-card-foreground shadow-sm">
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                                <TableHead className="pl-6 w-[150px]">Incident Type</TableHead>
                                                <TableHead>Respondent</TableHead>
                                                <TableHead className="w-[300px]">Description</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Filed Date</TableHead>
                                                <TableHead>Hearing</TableHead>
                                                <TableHead className="text-right pr-6">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {blotters.data.map((blotter) => {
                                                const created = formatDateTime(blotter.created_at);
                                                const scheduled = formatDateTime(blotter.scheduled_at);
                                                return (
                                                    <TableRow key={blotter.id} className="group">
                                                        <TableCell className="pl-6 font-medium capitalize">{blotter.type}</TableCell>
                                                        <TableCell>{blotter.respondent_name || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                                                        <TableCell className="max-w-[300px] truncate text-muted-foreground" title={blotter.description}>
                                                            {blotter.description}
                                                        </TableCell>
                                                        <TableCell>
                                                            <StatusBadge blotter={blotter} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">{created.date}</span>
                                                                <span className="text-xs text-muted-foreground">{created.time}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">{scheduled.date}</span>
                                                                <span className="text-xs text-muted-foreground">{scheduled.time}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link href={route('residentuser.blotter.show', blotter.id)}>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                {blotter.status === 'pending' && (
                                                                    <>
                                                                        <Link href={route('residentuser.blotter.edit', blotter.id)}>
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </Link>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                            onClick={() => handleDelete(blotter.id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* Mobile View (Cards) */}
                            <div className="md:hidden space-y-4">
                                {blotters.data.map((blotter) => {
                                    const created = formatDateTime(blotter.created_at);
                                    const scheduled = formatDateTime(blotter.scheduled_at);
                                    return (
                                        <Card key={blotter.id} className="overflow-hidden border shadow-sm">
                                            <CardHeader className="bg-muted/30 p-4 pb-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <CardTitle className="text-base font-semibold capitalize">
                                                                {blotter.type}
                                                            </CardTitle>
                                                        </div>
                                                        <CardDescription className="flex items-center gap-1 text-xs">
                                                            <IconClock className="w-3 h-3" /> Filed: {created.date}
                                                        </CardDescription>
                                                    </div>
                                                    <StatusBadge blotter={blotter} />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full text-blue-600 dark:text-blue-400">
                                                        <IconUser className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Respondent</p>
                                                        <p className="text-sm font-medium">{blotter.respondent_name || 'Not Specified'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-full text-orange-600 dark:text-orange-400">
                                                        <IconFileText className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</p>
                                                        <p className="text-sm text-foreground truncate">{blotter.description}</p>
                                                    </div>
                                                </div>

                                                {blotter.scheduled_at && (
                                                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                                                        <div className="mt-0.5 text-blue-600">
                                                            <IconCalendar className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Hearing Schedule</p>
                                                            <p className="text-sm font-semibold">{scheduled.date} <span className="text-muted-foreground font-normal">at</span> {scheduled.time}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                            <CardFooter className="p-3 bg-muted/20 flex gap-2">
                                                <Link href={route('residentuser.blotter.show', blotter.id)} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                                                </Link>

                                                {blotter.status === 'pending' && (
                                                    <>
                                                        <Link href={route('residentuser.blotter.edit', blotter.id)}>
                                                            <Button variant="outline" size="icon" className="h-9 w-9 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-9 w-9 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                                                            onClick={() => handleDelete(blotter.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            <div className="mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={blotters.prev_page_url || '#'}
                                                className={!blotters.prev_page_url ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>

                                        <div className="hidden sm:flex gap-1">
                                            {blotters.links.slice(1, -1).map((link, idx) => (
                                                <PaginationItem key={idx}>
                                                    <PaginationLink
                                                        href={link.url || '#'}
                                                        isActive={link.active}
                                                    >
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                        </div>

                                        <PaginationItem>
                                            <PaginationNext
                                                href={blotters.next_page_url || '#'}
                                                className={!blotters.next_page_url ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </>
                    ) : (
                        <Card>{EmptyBlotterState}</Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
