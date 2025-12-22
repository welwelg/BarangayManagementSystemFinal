import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, FileText, Mail, User, ShieldAlert, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Reuse interface or import it if you have a types file
interface Blotter {
    id: number;
    type: string;
    description: string;
    respondent_name: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    scheduled_at: string | null;
    admin_notes: string | null;
    user: {
        name: string;
        email: string;
    };
}

export default function Show({ blotter }: { blotter: Blotter }) {
    const breadcrumbs = [
        { title: 'Blotter Management', href: '/admin/blotter' },
        { title: 'View Report', href: `/admin/blotter/${blotter.id}` },
    ];

    // Helper for Status Badge Styling
    const getStatusBadge = (status: string) => {
        const styles = {
            approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
            rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        };

        const icons = {
            approved: <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />,
            rejected: <XCircle className="w-3.5 h-3.5 mr-1.5" />,
            pending: <AlertCircle className="w-3.5 h-3.5 mr-1.5" />,
        };

        const style = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
        const icon = icons[status as keyof typeof icons] || null;

        return (
            <Badge variant="outline" className={cn("capitalize font-medium py-1 px-3", style)}>
                {icon}
                {status}
            </Badge>
        );
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const formatTime = (date: string) => new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Blotter #${blotter.id}`} />

            <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-background py-6 sm:py-10">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    Blotter Case #{blotter.id}
                                </h1>
                                {getStatusBadge(blotter.status)}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Filed on {formatDate(blotter.created_at)} at {formatTime(blotter.created_at)}</span>
                            </div>
                        </div>
                        <Link href={route('admin.blotter.index')}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to List
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main Content: Incident Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="shadow-sm">
                                <CardHeader className="border-b bg-muted/20 pb-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <CardTitle className="text-lg">Incident Report Details</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {/* Type & Respondent Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-muted/30 p-4 rounded-lg border">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                                                Incident Type
                                            </label>
                                            <p className="text-base font-medium capitalize">{blotter.type}</p>
                                        </div>
                                        <div className="bg-muted/30 p-4 rounded-lg border">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                                                Respondent
                                            </label>
                                            <p className="text-base font-medium">{blotter.respondent_name || 'Not Specified'}</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Narrative */}
                                    <div>
                                        <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <span className="w-1 h-4 bg-primary rounded-full"></span>
                                            Narrative / Description
                                        </label>
                                        <div className="p-4 rounded-lg border bg-card text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground min-h-[120px]">
                                            {blotter.description}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Admin Notes Section */}
                            {blotter.admin_notes && (
                                <Card className="shadow-sm border-blue-100 dark:border-blue-900">
                                    <CardHeader className="pb-3 bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900">
                                        <CardTitle className="text-base flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                            <ShieldAlert className="w-4 h-4" />
                                            Admin Notes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                                            "{blotter.admin_notes}"
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar: Meta Details */}
                        <div className="space-y-6">
                            {/* Complainant Card */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3 border-b bg-muted/20">
                                    <CardTitle className="text-base font-medium flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Complainant
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium truncate text-foreground">{blotter.user.name}</p>
                                            <div className="flex items-center text-xs text-muted-foreground truncate mt-0.5">
                                                <Mail className="w-3 h-3 mr-1.5 shrink-0" />
                                                <span className="truncate">{blotter.user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Hearing Schedule Card */}
                            <Card className={cn("shadow-sm transition-all duration-200",
                                blotter.scheduled_at ? "border-blue-200 dark:border-blue-800 ring-1 ring-blue-100 dark:ring-blue-900" : ""
                            )}>
                                <CardHeader className={cn("pb-3 border-b",
                                    blotter.scheduled_at ? "bg-blue-50/50 dark:bg-blue-900/20" : "bg-muted/20"
                                )}>
                                    <CardTitle className="text-base font-medium flex items-center gap-2">
                                        <Calendar className={cn("w-4 h-4", blotter.scheduled_at ? "text-blue-600 dark:text-blue-400" : "")} />
                                        Hearing Schedule
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {blotter.scheduled_at ? (
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm p-2 rounded-md bg-muted/50">
                                                    <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                                                    <span className="font-medium">
                                                        {formatDate(blotter.scheduled_at)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm p-2 rounded-md bg-muted/50">
                                                    <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                                                    <span className="font-medium">
                                                        {formatTime(blotter.scheduled_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            {blotter.status === 'approved' && (
                                                <div className="pt-2">
                                                    <Link href={route('admin.blotter.edit', blotter.id)}>
                                                        <Button variant="secondary" size="sm" className="w-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                                            Reschedule Hearing
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4 text-center space-y-2">
                                            <div className="p-2 rounded-full bg-muted">
                                                <Calendar className="w-8 h-8 text-muted-foreground/50" />
                                            </div>
                                            <p className="text-sm text-muted-foreground italic">
                                                No hearing scheduled yet.
                                            </p>
                                            {blotter.status === 'pending' && (
                                                <Link href={route('admin.blotter.edit', blotter.id)} className="w-full pt-2">
                                                    <Button size="sm" className="w-full">
                                                        Schedule Now
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
