import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

interface Blotter {
  id: number;
  type: string;
  description: string;
  respondent_name: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'settled';
  created_at: string;
  scheduled_at: string | null;
  admin_notes: string | null;
  approved_by: { id: number; name: string } | null;
}

export default function Show({ blotter }: { blotter: Blotter }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Blotter', href: '/user/blotter' },
    { title: 'Details', href: `/user/blotter/${blotter.id}` },
  ];

  // ✅ Updated Status Logic
  const getStatusBadge = () => {
      if (blotter.status === 'settled') {
          return <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100">Case Closed</Badge>;
      }
      if (blotter.status === 'approved' && blotter.scheduled_at && new Date(blotter.scheduled_at) < new Date()) {
          return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">Awaiting Final Result</Badge>;
      }

      const configs = {
          pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending Review' },
          approved: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Approved' },
          rejected: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' },
      };

      const config = configs[blotter.status as keyof typeof configs] || { color: 'bg-gray-100', label: blotter.status };

      return (
          <Badge variant="outline" className={config.color}>
              {config.label}
          </Badge>
      );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not yet scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Blotter #${blotter.id}`} />

      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-xl">Blotter Report </CardTitle>
                    <CardDescription>
                    Filed on {new Date(blotter.created_at).toLocaleDateString()}
                    </CardDescription>
                </div>
                {getStatusBadge()}
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-6">

              {/* Row 1: Type & Respondent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-muted-foreground">Incident Type</Label>
                  <div className="font-medium text-lg">{blotter.type}</div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-muted-foreground">Respondent</Label>
                  <div className="font-medium text-lg">
                    {blotter.respondent_name || <span className="text-gray-400 italic">Unknown</span>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Row 2: Description */}
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Incident Description</Label>
                <div className="rounded-md bg-muted/50 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {blotter.description}
                </div>
              </div>

              {/* Row 3: Admin Section */}
              {blotter.status !== 'pending' && (
                <>
                    <Separator />
                    <div className="rounded-lg border bg-slate-50 p-4 dark:bg-slate-900">
                        <h4 className="mb-4 font-semibold text-sm uppercase tracking-wider text-slate-500">
                            Official Action
                        </h4>

                        <div className="grid gap-4">
                            {/* Special Message if Settled */}
                            {blotter.status === 'settled' && (
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md border border-green-100">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="font-medium">This case has been officially closed/settled.</span>
                                </div>
                            )}

                            {blotter.scheduled_at && (
                                <div className="grid gap-1">
                                    <Label className="text-blue-600">Scheduled Hearing</Label>
                                    <div className="font-bold text-lg">{formatDate(blotter.scheduled_at)}</div>
                                </div>
                            )}

                            {blotter.admin_notes && (
                                <div className="grid gap-1">
                                    <Label>Admin Notes / Resolution</Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{blotter.admin_notes}</p>
                                </div>
                            )}

                            {blotter.approved_by && (
                                <div className="text-xs text-right text-gray-400 mt-2">
                                    Processed by: {blotter.approved_by.name}
                                </div>
                            )}
                        </div>
                    </div>
                </>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.history.back()}>
              ← Back to List
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
