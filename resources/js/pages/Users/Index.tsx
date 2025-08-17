import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2, UserPen, UserPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

type User = {
    id: number;
    name: string;
    email: string;
};

interface IndexProps {
    users: User[];
}

export default function Index({ users }: IndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
            console.log(`User with id ${id} deleted`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="m-4">
                {can('users.create') && (
                    <Link href={route('users.create')}>
                        <UserPlus className="size-10 rounded-full bg-black p-2 text-white hover:bg-gray-800" />
                    </Link>
                )}
            </div>

            {/* Table Section */}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    <Table>
                        <TableCaption className="text-base font-medium">A list of Users</TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gray-100 dark:bg-gray-800">
                                {/* Dati: ID → Ginawa kong Index */}
                                <TableHead className="px-6 py-4 text-lg font-bold">ID</TableHead>
                                <TableHead className="px-6 py-4 text-lg font-bold">Name</TableHead>
                                <TableHead className="px-6 py-4 text-lg font-bold">Email</TableHead>
                                <TableHead className="px-6 py-4 text-lg font-bold">Roles</TableHead>
                                <TableHead className="px-6 py-4 text-center text-lg font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Ginamit ang index sa map para sunod-sunod (1,2,3...) */}
                            {users.map(({ id, name, email, roles }, index) => (
                                <TableRow key={id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    {/* Instead of id → gumamit ng index + 1 */}
                                    <TableCell className="px-6 py-4 text-base font-semibold">{index + 1}</TableCell>
                                    <TableCell className="px-6 py-4 text-base font-semibold">{name}</TableCell>
                                    <TableCell className="px-6 py-4 text-base font-semibold">{email}</TableCell>
                                    <TableCell className="px-6 py-4 text-base font-semibold">
                                        {roles.map((role) => (
                                            <span
                                                key={role.id}
                                                className="mr-2 inline-block rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-800 dark:text-green-100"
                                            >
                                                {role.name}
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell className="space-x-2 px-6 py-4 text-center">
                                        {/* View Button */}
                                        <Link href={route('users.show', id)}>
                                            <Button className="h-9 w-9 bg-gray-500 hover:bg-gray-700">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>

                                        {/* Edit Button */}
                                        <Link href={route('users.edit', id)}>
                                            <Button className="h-9 w-9 bg-blue-500 hover:bg-blue-700">
                                                <UserPen className="h-4 w-4" />
                                            </Button>
                                        </Link>

                                        {/* Delete Button */}
                                        <Button onClick={() => handleDelete(id)} className="h-9 w-9 bg-red-500 hover:bg-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
