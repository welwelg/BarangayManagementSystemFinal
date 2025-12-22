import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Eye,
    CalendarClock,
    FileText,
    Clock,
    CalendarDays,
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
    Gavel,
    Trash2,
    CheckSquare,
    Activity,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Autoplay from "embla-carousel-autoplay"
import { toast } from 'sonner';

const breadcrumbs = [{ title: 'Blotter Management', href: '/admin/blotter' }];

interface Blotter {
    id: number;
    type: string;
    description: string;
    respondent_name: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'settled';
    created_at: string;
    scheduled_at: string | null;
    user: { id: number; name: string; email: string };
}

interface AdminBlotterIndexProps {
    blotters: {
        data: Blotter[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: {
        total: number;
        pending: number;
        resolved: number; // Ensure this is passed from controller
        upcoming_hearings: {
            id: number;
            date: string;
            time: string;
            respondent: string | null;
            type: string;
        }[];
    };
}

const StatusBadge = ({ status, scheduledAt }: { status: string, scheduledAt?: string | null }) => {
    const isOverdue = status === 'approved' && scheduledAt && new Date(scheduledAt) < new Date();

    if (isOverdue) {
        return (
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 flex items-center gap-1 shrink-0 w-fit">
                <AlertCircle className="w-3 h-3" />
                Needs Update
            </Badge>
        );
    }

    const styles = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        settled:  "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    };

    const icons: Record<string, React.ReactNode> = {
        pending: <Clock className="w-3 h-3 mr-1" />,
        approved: <Gavel className="w-3 h-3 mr-1" />,
        rejected: <XCircle className="w-3 h-3 mr-1" />,
        settled: <CheckCircle className="w-3 h-3 mr-1" />,
    };

    const style = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
    const icon = icons[status] || null;

    return (
        <Badge variant="outline" className={cn("capitalize border shrink-0 w-fit flex items-center", style)}>
            {status === 'pending' && <Spinner className="mr-2 h-3 w-3" />}
            {!status.includes('pending') && icon}
            {status}
        </Badge>
    );
};

export default function Index({ blotters, stats }: AdminBlotterIndexProps) {

    const formatDate = (dateString: string | null) => {
        if (!dateString) return <span className="text-muted-foreground text-xs italic">Not set</span>;
        return (
            <div className="flex flex-col">
                <span className="font-medium text-sm">{new Date(dateString).toLocaleDateString()}</span>
                <span className="text-xs text-muted-foreground">{new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        );
    };

    const handleResolveToggle = (blotterId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'settled' ? 'approved' : 'settled';
        router.put(route('admin.blotter.update-status', blotterId), { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Case marked as ${newStatus}`),
            onError: () => toast.error("Failed to update status"),
        });
    };

    const handleDelete = (blotterId: number) => {
        toast("Delete this record?", {
            description: "This action cannot be undone. Only settled cases can be deleted.",
            action: {
                label: "Confirm Delete",
                onClick: () => {
                    router.delete(route('admin.blotter.destroy', blotterId), {
                        onSuccess: () => toast.success("Record deleted successfully"),
                        onError: () => toast.error("Failed to delete record"),
                    });
                },
            },
            cancel: { label: "Cancel", onClick: () => toast.dismiss() },
        });
    };

    const ActionButtons = ({ blotter, fullWidth = false }: { blotter: Blotter, fullWidth?: boolean }) => {
        const isOverdue = blotter.status === 'approved' && blotter.scheduled_at && new Date(blotter.scheduled_at) < new Date();
        const isPending = blotter.status === 'pending';
        const targetRoute = (isPending || isOverdue)
            ? route('admin.blotter.edit', blotter.id)
            : route('admin.blotter.show', blotter.id);

        return (
            <div className={cn("flex items-center gap-2", fullWidth ? "w-full mt-3" : "justify-end")}>
                <Link href={targetRoute} className="flex-1">
                    <Button
                        size="sm"
                        variant={(isPending || isOverdue) ? 'default' : 'secondary'}
                        className="w-full h-8"
                    >
                        {(isPending || isOverdue) ? (
                            <> <CalendarClock className="w-3.5 h-3.5 mr-2" /> {isOverdue ? 'Update' : 'Review'} </>
                        ) : (
                            <> <Eye className="w-3.5 h-3.5 mr-2" /> View </>
                        )}
                    </Button>
                </Link>

                {blotter.status === 'settled' && (
                    <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 px-0 shrink-0"
                        onClick={() => handleDelete(blotter.id)}
                        title="Delete Settled Case"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Blotter Management" />

            <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-background py-6 sm:py-10">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Blotter Management</h1>
                            <p className="text-muted-foreground mt-1">Oversee, schedule, and resolve resident complaints.</p>
                        </div>
                    </div>

                    {/* 3 Modern Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                        <Card className="shadow-sm border-l-4 border-l-blue-500 bg-card text-card-foreground">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Filings</CardTitle>
                                <FileText className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <p className="text-xs text-muted-foreground">Total cases recorded</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-l-4 border-l-yellow-500 bg-card text-card-foreground">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
                                <Activity className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{stats.pending}</div>
                                <p className="text-xs text-muted-foreground">Waiting for review</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-l-4 border-l-green-500 bg-card text-card-foreground">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Cases Resolved</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                {/* Fallback to 0 if 'resolved' isn't passed from controller yet */}
                                <div className="text-2xl font-bold text-green-600 dark:text-green-500">{stats.resolved || 0}</div>
                                <p className="text-xs text-muted-foreground">Succesfully closed cases</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Hearings Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                             <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                             Upcoming Hearing Schedule
                        </h2>

                        <Card className="relative overflow-hidden bg-linear-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 border-blue-100 dark:border-slate-800">
                            <CardContent className="pt-6">
                                {stats.upcoming_hearings && stats.upcoming_hearings.length > 0 ? (
                                    <Carousel
                                        className="w-full"
                                        plugins={[Autoplay({ delay: 5000 })]}
                                        opts={{
                                            align: "start",
                                            loop: true,
                                        }}
                                    >
                                        <CarouselContent className="-ml-4">
                                            {stats.upcoming_hearings.map((hearing, index) => (
                                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                                    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border shadow-sm flex flex-col space-y-3 h-full hover:shadow-md transition-shadow">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-2">
                                                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                                                     <Calendar className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-base text-foreground">{hearing.date}</div>
                                                                    <div className="text-xs text-muted-foreground">{hearing.time}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1 pt-2 border-t border-dashed">
                                                            <div className="text-sm font-medium text-foreground truncate">
                                                                vs {hearing.respondent || 'Unknown'}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                                                                <Gavel className="w-3 h-3" /> {hearing.type}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <CarouselPrevious className="static h-9 w-9 translate-y-0 border-primary/20 hover:bg-primary/10" />
                                            <CarouselNext className="static h-9 w-9 translate-y-0 border-primary/20 hover:bg-primary/10" />
                                        </div>
                                    </Carousel>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                                        <div className="bg-muted p-4 rounded-full mb-3">
                                            <CalendarDays className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="font-medium">No hearings scheduled</p>
                                        <p className="text-sm opacity-70">There are no upcoming hearings for the next few days.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Table Card */}
                    <Card className="overflow-hidden border shadow-sm bg-card">
                        <CardHeader className="px-6 border-b bg-muted/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Filings</CardTitle>
                                    <CardDescription>Monitor and manage all resident complaints.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableHead className="pl-6 w-[250px]">Complainant / Respondent</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Dates</TableHead>
                                            <TableHead className="text-center w-[100px]">Resolved?</TableHead>
                                            <TableHead className="text-right pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {blotters.data.length > 0 ? (
                                            blotters.data.map((blotter) => (
                                                <TableRow key={blotter.id} className="group hover:bg-muted/30">
                                                    <TableCell className="pl-6">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-3 h-3 text-blue-500" />
                                                                <span className="font-medium text-foreground">{blotter.user.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-muted-foreground text-xs ml-5">
                                                                <span>vs</span>
                                                                <span className="font-medium">{blotter.respondent_name || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-foreground">{blotter.type}</TableCell>

                                                    <TableCell>
                                                        <StatusBadge status={blotter.status} scheduledAt={blotter.scheduled_at} />
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex flex-col text-xs gap-1">
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <FileText className="w-3 h-3" /> {formatDate(blotter.created_at)}
                                                            </div>
                                                            {blotter.scheduled_at && (
                                                                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                                                                    <CalendarClock className="w-3 h-3" /> {formatDate(blotter.scheduled_at)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center">
                                                            <Checkbox
                                                                checked={blotter.status === 'settled'}
                                                                disabled={blotter.status === 'pending' || blotter.status === 'rejected'}
                                                                onCheckedChange={() => handleResolveToggle(blotter.id, blotter.status)}
                                                                className="h-5 w-5 border-2 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                            />
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="text-right pr-6">
                                                        <ActionButtons blotter={blotter} />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                    No blotter reports found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile View (Cards) */}
                            <div className="md:hidden flex flex-col divide-y divide-border">
                                {blotters.data.length > 0 ? (
                                    blotters.data.map((blotter) => (
                                        <div key={blotter.id} className="p-4 flex flex-col space-y-4 bg-card">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground text-sm">{blotter.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">vs {blotter.respondent_name || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <StatusBadge status={blotter.status} scheduledAt={blotter.scheduled_at} />
                                            </div>

                                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm bg-muted/30 p-3 rounded-md border">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-medium text-muted-foreground uppercase">Type</span>
                                                    <span className="font-medium text-foreground">{blotter.type}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-medium text-muted-foreground uppercase">Filed</span>
                                                    <span>{formatDate(blotter.created_at)}</span>
                                                </div>
                                                {blotter.scheduled_at && (
                                                    <div className="flex flex-col gap-1 col-span-2 pt-2 border-t mt-1">
                                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1">
                                                            <CalendarClock className="w-3 h-3" /> Scheduled Hearing
                                                        </span>
                                                        <span className="font-semibold">{formatDate(blotter.scheduled_at)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between p-3 border rounded-md bg-background shadow-sm">
                                                <span className="text-sm font-medium flex items-center gap-2">
                                                    <CheckSquare className="w-4 h-4 text-green-600" /> Mark as Resolved
                                                </span>
                                                <Checkbox
                                                    checked={blotter.status === 'settled'}
                                                    disabled={blotter.status === 'pending' || blotter.status === 'rejected'}
                                                    onCheckedChange={() => handleResolveToggle(blotter.id, blotter.status)}
                                                    className="h-5 w-5 border-2 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                                />
                                            </div>

                                            <ActionButtons blotter={blotter} fullWidth={true} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground">
                                        No blotter reports found.
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="border-t p-4 bg-muted/20">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={blotters.prev_page_url || '#'}
                                                size="default"
                                                className={!blotters.prev_page_url ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                        <div className="hidden sm:flex flex-row gap-1">
                                            {blotters.links.slice(1, -1).map((link, idx) => (
                                                <PaginationItem key={idx}>
                                                    <PaginationLink
                                                        href={link.url || '#'}
                                                        isActive={link.active}
                                                        size="default"
                                                    >
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                        </div>
                                        <PaginationItem>
                                            <PaginationNext
                                                href={blotters.next_page_url || '#'}
                                                size="default"
                                                className={!blotters.next_page_url ? "pointer-events-none opacity-50" : ""}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
