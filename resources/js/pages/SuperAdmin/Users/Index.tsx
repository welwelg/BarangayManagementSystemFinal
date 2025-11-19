import { ModalForm } from '@/components/ModalForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { toast } from '@/lib/toast';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Eye, FolderKanban, Mail, Trash2, User as UserIcon, UserPen, UserPlus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Manage Users', href: '/users' }];

type Role = { id: number; name: string };
type User = { id: number; name: string; email: string; roles: Role[] };

interface IndexProps {
    users: User[];
    roles?: string[];
}

export default function Index({ users, roles = [] }: IndexProps) {
    const { residents, auth } = usePage().props as any;
    const currentUserId = auth?.user?.id;
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form for CREATE
    const { data, setData, post, errors, processing, reset } = useForm({
        floating_name: residents ? `${residents.first_name} ${residents.middle_name ?? ''} ${residents.last_name}`.trim() : '',
        floating_email: residents?.email ?? '',
        floating_password: '',
        floating_repeat_password: '',
        roles: [] as string[],
    });

    // Separate form for EDIT
    const {
        data: editData,
        setData: setEditData,
        put,
        errors: editErrors,
        processing: editProcessing,
        reset: resetEdit,
    } = useForm({
        floating_name: '',
        floating_email: '',
        floating_password: '',
        floating_repeat_password: '',
        roles: [] as string[],
    });

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                toast.success('User created successfully!');
                closeModal();
            },
            onError: () => {
                toast.error('Failed to create user.');
            },
        });
    };

    const openEdit = (user: User) => {
        setEditingUser(user);
        setEditData({
            floating_name: user.name,
            floating_email: user.email,
            floating_password: '',
            floating_repeat_password: '',
            roles: user.roles.map((r) => r.name),
        });
        setIsEditOpen(true);
    };

    const closeEdit = () => {
        setIsEditOpen(false);
        setEditingUser(null);
        resetEdit();
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        put(route('users.update', editingUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('User updated successfully!');
                closeEdit();
            },
            onError: () => {
                toast.error('Failed to update user.');
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id), {
                onSuccess: () => {
                    toast.success('User deleted successfully.');
                },
                onError: () => {
                    toast.error('Failed to delete user.');
                },
            });
        }
    };

    const handleCheckboxChange = (roleName: string, checked: boolean) => {
        setData('roles', checked ? [...data.roles, roleName] : data.roles.filter((r) => r !== roleName));
    };

    const handleEditCheckboxChange = (roleName: string, checked: boolean) => {
        setEditData('roles', checked ? [...editData.roles, roleName] : editData.roles.filter((r) => r !== roleName));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />

            <div className="min-h-screen bg-white dark:bg-gray-950">
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
                            <Button
                                onClick={openModal}
                                className="w-full bg-sky-400 text-sky-950 hover:bg-sky-600 hover:text-sky-50 sm:w-auto dark:bg-sky-600 dark:text-white dark:hover:bg-sky-700"
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        )}
                    </div>

                    {/* Add User Modal */}
                    <ModalForm
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        title="Add User"
                        description="Fill in the details below to create a new user account"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div className="grid gap-2">
                                <label htmlFor="floating_name" className="text-sm font-medium">
                                    Name
                                </label>
                                <Input
                                    id="floating_name"
                                    type="text"
                                    value={data.floating_name}
                                    onChange={(e) => setData('floating_name', e.target.value)}
                                    required
                                    className="w-full"
                                />
                                {errors.floating_name && <p className="text-sm text-red-600">{errors.floating_name}</p>}
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <label htmlFor="floating_email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="floating_email"
                                    type="email"
                                    value={data.floating_email}
                                    onChange={(e) => setData('floating_email', e.target.value)}
                                    required
                                    className="w-full"
                                />
                                {errors.floating_email && <p className="text-sm text-red-600">{errors.floating_email}</p>}
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <label htmlFor="floating_password" className="text-sm font-medium">
                                    Password
                                </label>
                                <Input
                                    id="floating_password"
                                    type="password"
                                    value={data.floating_password}
                                    onChange={(e) => setData('floating_password', e.target.value)}
                                    required
                                    className="w-full"
                                />
                                {errors.floating_password && <p className="text-sm text-red-600">{errors.floating_password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-2">
                                <label htmlFor="floating_repeat_password" className="text-sm font-medium">
                                    Confirm Password
                                </label>
                                <Input
                                    id="floating_repeat_password"
                                    type="password"
                                    value={data.floating_repeat_password}
                                    onChange={(e) => setData('floating_repeat_password', e.target.value)}
                                    required
                                    className="w-full"
                                />
                                {errors.floating_repeat_password && <p className="text-sm text-red-600">{errors.floating_repeat_password}</p>}
                            </div>

                            {/* Roles */}
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Permissions</label>

                                <div className="flex max-h-40 flex-col space-y-2 overflow-y-auto rounded-md border p-1">
                                    {roles.length > 0 ? (
                                        roles.map((role) => (
                                            <label key={role} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.roles.includes(role)}
                                                    onChange={(e) => handleCheckboxChange(role, e.target.checked)}
                                                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm">{role}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No roles available</p>
                                    )}
                                </div>

                                {errors.roles && <p className="text-sm text-red-600">{errors.roles}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col items-stretch gap-2 pt-2 sm:flex-row sm:items-center">
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? 'Creating...' : 'Submit'}
                                </Button>

                                <Button type="button" variant="outline" onClick={closeModal} className="w-full sm:w-auto">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </ModalForm>

                    {/* Edit User Modal  */}
                    <ModalForm open={isEditOpen} onOpenChange={setIsEditOpen} title="Edit User" description="Update the user information below">
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid gap-2">
                                <label htmlFor="edit_name" className="text-sm font-medium">
                                    Name
                                </label>
                                <Input
                                    id="edit_name"
                                    type="text"
                                    value={editData.floating_name}
                                    onChange={(e) => setEditData('floating_name', e.target.value)}
                                    required
                                />
                                {editErrors.floating_name && <p className="text-sm text-red-600">{editErrors.floating_name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="edit_email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="edit_email"
                                    type="email"
                                    value={editData.floating_email}
                                    onChange={(e) => setEditData('floating_email', e.target.value)}
                                    required
                                />
                                {editErrors.floating_email && <p className="text-sm text-red-600">{editErrors.floating_email}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="edit_password" className="text-sm font-medium">
                                    Password <span className="text-gray-500">(leave blank to keep current)</span>
                                </label>
                                <Input
                                    id="edit_password"
                                    type="password"
                                    value={editData.floating_password}
                                    onChange={(e) => setEditData('floating_password', e.target.value)}
                                />
                                {editErrors.floating_password && <p className="text-sm text-red-600">{editErrors.floating_password}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="edit_repeat_password" className="text-sm font-medium">
                                    Confirm Password
                                </label>
                                <Input
                                    id="edit_repeat_password"
                                    type="password"
                                    value={editData.floating_repeat_password}
                                    onChange={(e) => setEditData('floating_repeat_password', e.target.value)}
                                />
                                {editErrors.floating_repeat_password && <p className="text-sm text-red-600">{editErrors.floating_repeat_password}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Permissions</label>
                                <div className="flex flex-col space-y-2">
                                    {roles.length > 0 ? (
                                        roles.map((role) => (
                                            <label key={role} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editData.roles.includes(role)}
                                                    onChange={(e) => handleEditCheckboxChange(role, e.target.checked)}
                                                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm">{role}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No roles available</p>
                                    )}
                                </div>
                                {editErrors.roles && <p className="text-sm text-red-600">{editErrors.roles}</p>}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={editProcessing}>
                                    {editProcessing ? 'Updating...' : 'Update User'}
                                </Button>
                                <Button type="button" variant="outline" onClick={closeEdit}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </ModalForm>

                    {/* Desktop Table View */}
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
                                        users.map((user, index) => (
                                            <TableRow key={user.id} className="hover:bg-sky-100/50 dark:hover:bg-sky-800/50">
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.length ? (
                                                            user.roles.map((role) => (
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
                                                        <Link href={route('users.show', user.id)}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        {can('users.edit') && (
                                                            <Button onClick={() => openEdit(user)} variant="outline" size="icon" className="h-8 w-8">
                                                                <UserPen className="h-4 w-4" />
                                                            </Button>
                                                        )}

                                                        {can('users.delete') && user.id !== currentUserId && (
                                                            <Button
                                                                onClick={() => handleDelete(user.id)}
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

                    {/* Mobile Card View */}
                    <div className="grid gap-4 md:hidden">
                        {users.length === 0 ? (
                            <Card className="border-sky-200 bg-white dark:border-sky-800 dark:bg-sky-900">
                                <CardContent className="flex h-32 items-center justify-center">
                                    <p className="text-muted-foreground">No users found</p>
                                </CardContent>
                            </Card>
                        ) : (
                            users.map((user) => (
                                <Card key={user.id} className="overflow-hidden border-sky-200 bg-white dark:border-sky-800 dark:bg-sky-900">
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-800">
                                                    <UserIcon className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="leading-none font-semibold">{user.name}</p>
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        <span className="truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">
                                                {user.roles.length ? (
                                                    user.roles.map((role) => (
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

                                            <div className="flex gap-2 pt-2">
                                                <Link href={route('users.show', user.id)} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Button>
                                                </Link>

                                                {can('users.edit') && (
                                                    <Button onClick={() => openEdit(user)} variant="outline" size="sm" className="flex-1">
                                                        <UserPen className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                )}

                                                {can('users.delete') && user.id !== currentUserId && (
                                                    <Button
                                                        onClick={() => handleDelete(user.id)}
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
                            <Button onClick={openModal} className="mt-4 bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
