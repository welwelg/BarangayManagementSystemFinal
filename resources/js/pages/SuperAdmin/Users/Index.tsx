import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, FolderKanban, Mail, Trash2, User, UserPen, UserPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Manage Users', href: '/users' }];

type Role = { id: number; name: string };
type User = { id: number; name: string; email: string; roles: Role[] };

interface IndexProps {
    users: User[];
}

export default function Index({ users }: IndexProps) {
    const { auth } = usePage().props as any;
    const currentUserId = auth?.user?.id;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />

            <div className="min-h-screen bg-sky-50 dark:bg-gray-950">
                <div className="container mx-auto space-y-4 p-4 md:p-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-bold text-sky-950 md:text-3xl dark:text-white">
                                <FolderKanban className="h-6 w-6 text-sky-950 md:h-8 md:w-8 dark:text-white" />
                                Manage Users
                            </h1>
                            <p className="mt-1 text-sm text-sky-900 dark:text-white">
                                {users.length} user{users.length !== 1 ? 's' : ''} total
                            </p>
                        </div>

                        {can('users.create') && (
                            <Link href={route('users.create')}>
                                <Button className="w-full bg-sky-500 text-white hover:bg-sky-600 sm:w-auto dark:bg-sky-600 dark:hover:bg-sky-700">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add User
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Desktop Table View (md and up) */}
                    <div className="hidden md:block">
                        <div className="overflow-hidden rounded-lg border border-sky-200 bg-white shadow-sm dark:border-sky-800 dark:bg-gray-950">
                            <Table>
                                <TableCaption className="text-base font-medium">List of Users</TableCaption>

                                <TableHeader>
                                    <TableRow className="bg-sky-300 dark:bg-sky-800">
                                        <TableHead className="w-[60px] font-bold">#</TableHead>
                                        <TableHead className="font-bold">Name</TableHead>
                                        <TableHead className="font-bold">Email</TableHead>
                                        <TableHead className="font-bold">Roles</TableHead>
                                        <TableHead className="w-[200px] text-center font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                <p className="text-muted-foreground">No users found</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map(({ id, name, email, roles }, index) => (
                                            <TableRow key={id} className="hover:bg-sky-100/50 dark:hover:bg-sky-800/50">
                                                <TableCell className="font-medium">{index + 1}</TableCell>

                                                <TableCell className="font-medium">{name}</TableCell>

                                                <TableCell className="text-muted-foreground">{email}</TableCell>

                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {roles.length ? (
                                                            roles.map((role) => (
                                                                <span
                                                                    key={role.id}
                                                                    className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-100"
                                                                >
                                                                    {role.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground italic">No role assigned</span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link href={route('users.show', id)}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        {can('users.edit') && (
                                                            <Link href={route('users.edit', id)}>
                                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                                    <UserPen className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}

                                                        {can('users.delete') && id !== currentUserId && (
                                                            <Button
                                                                onClick={() => handleDelete(id)}
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Mobile Card View (below md) */}
                    <div className="grid gap-4 md:hidden">
                        {users.length === 0 ? (
                            <Card className="border-sky-200 bg-white dark:border-sky-800 dark:bg-sky-900">
                                <CardContent className="flex h-32 items-center justify-center">
                                    <p className="text-muted-foreground">No users found</p>
                                </CardContent>
                            </Card>
                        ) : (
                            users.map(({ id, name, email, roles }) => (
                                <Card key={id} className="overflow-hidden border-sky-200 bg-white dark:border-sky-800 dark:bg-sky-900">
                                    <CardContent className="p-4">
                                        {/* User Info */}
                                        <div className="space-y-3">
                                            {/* Name */}
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-800">
                                                    <User className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="leading-none font-semibold">{name}</p>
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        <span className="truncate">{email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Roles */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {roles.length ? (
                                                    roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-100"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground italic">No role assigned</span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-2">
                                                <Link href={route('users.show', id)} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Button>
                                                </Link>

                                                {can('users.edit') && (
                                                    <Link href={route('users.edit', id)} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full">
                                                            <UserPen className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                )}

                                                {can('users.delete') && id !== currentUserId && (
                                                    <Button
                                                        onClick={() => handleDelete(id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Empty State */}
                    {users.length === 0 && can('users.create') && (
                        <div className="mt-8 text-center">
                            <p className="text-sm text-muted-foreground">Get started by adding your first user</p>
                            <Link href={route('users.create')}>
                                <Button className="mt-4 bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add User
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
