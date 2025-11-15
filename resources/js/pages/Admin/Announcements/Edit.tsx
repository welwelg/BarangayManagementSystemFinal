import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { MdLocalPostOffice } from 'react-icons/md';

const breadcrumbs = [
    {
        title: 'Edit Announcement',
        href: '/admin/announcements/edit',
    },
];

interface Props {
    announcement: {
        id: number;
        title: string;
        message: string;
        type: string;
        meeting_date: string;
    };
}

export default function Edit({ announcement }: Props) {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        title: announcement.title || '',
        message: announcement.message || '',
        type: announcement.type || '',
        meeting_date: announcement.meeting_date || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('announcements.update', announcement.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit  Announcement" />

            <div className="p-6">
                <Card>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
                            <MdLocalPostOffice className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">Edit an Announcement</h1>
                        </div>
                        <CardContent className="space-y-6 p-6">
                            {/* Full width fields */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="example Barangay Meeting"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <span className="text-sm text-red-500">{errors.title}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Input Message"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                />
                                {errors.message && <span className="text-sm text-red-500">{errors.message}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <span className="text-sm text-red-500">{errors.type}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="meeting_date">Date of Meeting</Label>
                                <Input
                                    id="meeting_date"
                                    name="meeting_date"
                                    type="date"
                                    value={data.meeting_date || ''}
                                    min={new Date().toISOString().split('T')[0]} //  block past dates
                                    onChange={(e) => setData('meeting_date', e.target.value)}
                                    required
                                />
                                {errors.meeting_date && <span className="text-sm text-red-500">{errors.meeting_date}</span>}
                            </div>
                        </CardContent>

                        <CardFooter className="gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Announcement'}
                            </Button>
                            <Link href={route('announcements.index')}>
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
