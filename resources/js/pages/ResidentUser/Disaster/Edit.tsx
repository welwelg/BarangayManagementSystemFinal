import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { MdWarningAmber } from 'react-icons/md';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Edit Disaster Report', href: '/residentuser/disaster-reports/edit' }];

interface DisasterReport {
    id: number;
    disaster_type: string;
    description: string;
    location: string;
}

export default function Edit() {
    const { disasterReport } = usePage<{ disasterReport: DisasterReport }>().props;

    const { data, setData, put, processing, errors } = useForm({
        disaster_type: disasterReport.disaster_type || '',
        description: disasterReport.description || '',
        location: disasterReport.location || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('disaster-reports.update', disasterReport.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Disaster Report" />
            <div className="p-6">
                <Card className="mx-auto max-w-lg p-6">
                    <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
                        <MdWarningAmber className="h-8 w-8 fill-amber-500" />
                        <h1 className="text-2xl font-bold sm:text-3xl">Edit Disaster Report</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block font-medium">Disaster Type</label>
                            <Select value={data.disaster_type} onValueChange={(value) => setData('disaster_type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select disaster type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['Flood', 'Fire', 'Earthquake', 'Typhoon', 'Landslide', 'Storm', 'Other'].map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.disaster_type && <p className="text-sm text-red-500">{errors.disaster_type}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Description</label>
                            <Textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the disaster incident in detail..."
                                rows={4}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Location</label>
                            <Input
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="Enter specific location or address"
                            />
                            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                        </div>

                        <div className="flex space-x-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Report'}
                            </Button>
                            <Link href={route('disaster-reports.index')}>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
