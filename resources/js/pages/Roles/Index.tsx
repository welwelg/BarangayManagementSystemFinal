import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { SquarePlus, Trash2, UserPen, View } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index({ roles }) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', id));
            console.log(`Role with id ${id} deleted`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            {/* Add Button */}
            <div className="m-4">
                {can('roles.create') && (
                    <Link href={route('roles.create')}>
                        <SquarePlus className="size-10 rounded-full bg-black p-2 text-amber-50 hover:bg-gray-800" />
                    </Link>
                )}
            </div>

            {/* Table Section */}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    <Table>
                        <TableCaption className="text-base font-medium">A list of Roles</TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gray-100 dark:bg-gray-800">
                                <TableHead className="px-6 py-4 text-lg font-bold">ID</TableHead>
                                <TableHead className="px-6 py-4 text-lg font-bold">Name</TableHead>
                                <TableHead className="px-6 py-4 text-lg font-bold">Permissions</TableHead>
                                <TableHead className="px-6 py-4 text-center text-lg font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Ginamit ang index para mag-display ng sunod-sunod na numbering */}
                            {roles.map(({ id, name, permissions }, index) => (
                                <TableRow key={id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    {/* Instead of DB id → use index + 1 para palaging 1,2,3... */}
                                    <TableCell className="px-6 py-4 text-base font-semibold">{index + 1}</TableCell>
                                    <TableCell className="px-6 py-4 text-base font-semibold">{name}</TableCell>
                                    <TableCell className="px-6 py-4">
                                        {permissions.map((permission) => (
                                            <span
                                                key={permission.id}
                                                className="mr-2 inline-block rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-800 dark:text-green-100"
                                            >
                                                {permission.name}
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell className="space-x-2 px-6 py-4 text-center">
                                        <Link href={route('roles.show', id)}>
                                            <Button className="h-9 w-9 bg-gray-500 hover:bg-gray-700">
                                                <View className="h-4 w-4" />
                                            </Button>
                                        </Link>

                                        {can('roles.update') && (
                                            <Link href={route('roles.edit', id)}>
                                                <Button className="h-9 w-9 bg-blue-500 hover:bg-blue-700">
                                                    <UserPen className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}

                                        {can('roles.delete') && (
                                            <Button onClick={() => handleDelete(id)} className="h-9 w-9 bg-red-500 hover:bg-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
