import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BiSolidMessageAltEdit } from 'react-icons/bi';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Submit Complaint',
        href: '/user/complaints/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('residentuser.complaints.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submit Complaint" />

            <div className="p-6">
                <Card className="mx-auto max-w-lg">
                    <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
                        <BiSolidMessageAltEdit className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-bold sm:text-3xl">Submit Complaint</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 p-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Complaint Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="e.g. Noise, Illegal Parking"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <span className="text-sm text-red-500">{errors.title}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Complaint details / Location / Time"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                {errors.description && <span className="text-sm text-red-500">{errors.description}</span>}
                            </div>
                        </CardContent>

                        <CardFooter className="gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit Complaint'}
                            </Button>

                            <Link href={route('residentuser.complaints.index')}>
                                <Button
                                    variant="outline"
                                    className="m-5 border border-gray-300 bg-white text-gray-800 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    Back
                                </Button>
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
