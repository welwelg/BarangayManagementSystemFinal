import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Blotter', href: '/admin/blotter' }];

export default function Index() {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blotter" />

            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-10">
    {/* The main container/card */}
    <div className="w-full max-w-4xl bg-white mx-auto px-8 py-8 shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Request Blotter</h1>

        {/* Shadcn UI Table/Data Table Component */}
        <Table>
            <TableCaption>A list of recent blotter entries.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Respondent</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time Created</TableHead>
                    <TableHead>Date & Time Scheduled</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Complaint</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell> making noise at night.</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>2025-01-01 12:00:00</TableCell>
                    <TableCell>2025-01-01 12:00:00</TableCell>
                    <TableCell className="text-right">EDIT DELETE</TableCell>
                </TableRow>
                {/* ... other rows (e.g., mapped data) */}
            </TableBody>
        </Table>
    </div>
</div>
        </AppLayout>
    );
}
