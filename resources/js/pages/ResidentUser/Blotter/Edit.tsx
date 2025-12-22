import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import { UserCheck, Save, X, Edit3 } from 'lucide-react';

interface BlotterData {
    id: number;
    type: string;
    description: string;
    respondent_name: string | null;
    respondent_user_id: number | null;
    status: string;
}

interface User {
    id: number;
    name: string;
}

interface EditProps {
    blotter: BlotterData;
    users: User[];
}

export default function Edit({ blotter, users }: EditProps) {

    const { data, setData, put, processing, errors } = useForm({
        type: blotter.type || '',
        respondent_user_id: blotter.respondent_user_id ? blotter.respondent_user_id.toString() : '',
        respondent_name: blotter.respondent_name || '',
        description: blotter.description || '',
    });

    const isEditable = blotter.status === 'pending';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Blotter', href: '/user/blotter' },
        { title: 'Edit Report', href: `/user/blotter/${blotter.id}/edit` },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!isEditable) {
            toast.error("This report cannot be edited because it has already been processed.");
            return;
        }

        put(route('residentuser.blotter.update', blotter.id), {
            onSuccess: () => {
                toast.success('Blotter report updated successfully.');
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            }
        });
    };

    const handleRespondentSelect = (value: string) => {
        if (!isEditable) return;

        if (value === 'manual') {
            setData(data => ({ ...data, respondent_user_id: '', respondent_name: '' }));
        } else {
            const selectedUser = users.find(u => u.id.toString() === value);
            if (selectedUser) {
                setData(data => ({
                    ...data,
                    respondent_user_id: selectedUser.id.toString(),
                    respondent_name: selectedUser.name
                }));
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Blotter #${blotter.id}`} />

            <div className="flex min-h-screen w-full items-start justify-center bg-muted/40 p-4 sm:p-8 dark:bg-background">
                <div className="w-full max-w-3xl space-y-6">

                    {/* Header */}
                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Complaint</h1>
                        <p className="text-muted-foreground">
                            Update the details of your filed report.
                        </p>
                    </div>

                    <Card className="border shadow-sm dark:bg-card">
                        <CardHeader className="bg-muted/20 pb-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                    <Edit3 className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Report Details</CardTitle>
                                    <CardDescription>
                                        Case #{blotter.id} • {isEditable ? <span className="text-green-600 font-medium">Editable</span> : <span className="text-red-500 font-medium">Locked (Processed)</span>}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            <form onSubmit={submit} className="space-y-6">

                                {/* Incident Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="type">Nature of Incident</Label>
                                    <Select
                                        onValueChange={(value) => setData('type', value)}
                                        value={data.type}
                                        disabled={!isEditable}
                                    >
                                        <SelectTrigger className="h-11 bg-background">
                                            <SelectValue placeholder="Select type of incident" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Complaint">Complaint</SelectItem>
                                            <SelectItem value="Incident Report">Incident Report</SelectItem>
                                            <SelectItem value="Noise Complaint">Noise Complaint</SelectItem>
                                            <SelectItem value="Amicable Settlement">Amicable Settlement</SelectItem>
                                            <SelectItem value="Others">Others</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.type} />
                                </div>

                                {/* Respondent Section */}
                                <div className="rounded-lg border bg-slate-50 p-5 dark:bg-slate-900/50">
                                    <div className="mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <UserCheck className="h-4 w-4" />
                                        <h3 className="font-semibold text-sm uppercase tracking-wide">Respondent Information</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground uppercase">Update Respondent (Optional)</Label>
                                            <Select
                                                onValueChange={handleRespondentSelect}
                                                value={data.respondent_user_id || "manual"}
                                                disabled={!isEditable}
                                            >
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue placeholder="Search or Select a Resident..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="manual" className="font-medium text-blue-600">-- Manual Entry --</SelectItem>
                                                    {users.map((user) => (
                                                        <SelectItem key={user.id} value={user.id.toString()}>
                                                            {user.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="respondent_name">Respondent Name</Label>
                                            <div className="relative">
                                                <Input
                                                    id="respondent_name"
                                                    value={data.respondent_name}
                                                    readOnly={!!data.respondent_user_id || !isEditable}
                                                    disabled={!isEditable}
                                                    className={`h-11 ${data.respondent_user_id ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-background'}`}
                                                    onChange={(e) => setData('respondent_name', e.target.value)}
                                                />
                                                {data.respondent_user_id && (
                                                    <div className="absolute right-3 top-3 text-xs font-medium text-green-600 flex items-center gap-1">
                                                        <UserCheck className="h-3 w-3" /> Linked
                                                    </div>
                                                )}
                                            </div>
                                            <InputError message={errors.respondent_name} />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Detailed Narrative</Label>
                                    <Textarea
                                        id="description"
                                        className="min-h-[180px] resize-y bg-background leading-relaxed"
                                        value={data.description}
                                        disabled={!isEditable}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-4 border-t mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                        onClick={() => window.history.back()}
                                    >
                                        <X className="mr-2 h-4 w-4" /> Cancel
                                    </Button>

                                    {isEditable && (
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <> <Spinner className="mr-2 h-4 w-4" /> Saving... </>
                                            ) : (
                                                <> <Save className="mr-2 h-4 w-4" /> Save Changes </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
