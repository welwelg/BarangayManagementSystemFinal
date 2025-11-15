import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { MdWarningAmber } from 'react-icons/md';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Submit Disaster Report',
        href: '/residentuser/disaster-reports/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        disaster_type: '',
        description: '',
        location: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('disaster-reports.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submit Disaster Report" />

            <div className="p-6">
                <Card className="mx-auto max-w-lg p-4">
                    <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
                        <MdWarningAmber className="h-8 w-8 fill-amber-500" />
                        <h1 className="text-2xl font-bold sm:text-3xl">Submit Disaster Report</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block font-medium">Disaster Type</label>
                            <Select value={data.disaster_type} onValueChange={(value) => setData('disaster_type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select disaster type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Flood">Flood</SelectItem>
                                    <SelectItem value="Fire">Fire</SelectItem>
                                    <SelectItem value="Earthquake">Earthquake</SelectItem>
                                    <SelectItem value="Typhoon">Typhoon</SelectItem>
                                    <SelectItem value="Landslide">Landslide</SelectItem>
                                    <SelectItem value="Storm">Storm</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
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
                                type="text"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="Enter specific location or address"
                            />
                            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                        </div>

                        <div className="gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit Report'}
                            </Button>

                            <Link href={route('disaster-reports.index')}>
                                <Button
                                    variant="outline"
                                    className="m-5 border border-gray-300 bg-white text-gray-800 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
