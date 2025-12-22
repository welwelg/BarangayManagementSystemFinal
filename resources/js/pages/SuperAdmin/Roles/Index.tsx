import { ModalForm } from '@/components/ModalForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Notebook, SquarePlus, Trash2, UserPen, View } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles', href: '/roles' }];

type Permission = { id: number; name: string };
type Role = { id: number; name: string; permissions: Permission[] };

interface IndexProps {
    roles: Role[];
}

export default function Index({ roles }: IndexProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [editName, setEditName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [open, setOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddRole = (e: React.FormEvent) => {
        e.preventDefault();

        if (!roleName.trim()) {
            toast.error('Please enter a role name');
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('roles.store'),
            { name: roleName.trim() },
            {
                onSuccess: () => {
                    setOpen(false);
                    setRoleName('');
                    setIsSubmitting(false);
                    toast.success('Role added!', {
                        description: `${roleName} was successfully created.`,
                        duration: 3000,
                    });
                },

                onError: () => {
                    setIsSubmitting(false);
                    toast.error('Something went wrong', {
                        description: 'Unable to create role.',
                    });
                },

                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleEditClick = (role: Role) => {
        setEditRole(role);
        setEditName(role.name);
        setEditOpen(true);
    };

    const handleUpdateRole = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editRole) return;

        if (!editName.trim()) {
            toast.error('Please enter a role name');
            return;
        }

        if (editName.trim() === editRole.name.trim()) {
            toast.message('No changes detected', {
                description: 'You did not make any changes to the role.',
            });
            setEditOpen(false);
            return;
        }

        setIsUpdating(true);

        router.put(
            route('roles.update', editRole.id),
            { name: editName.trim() },
            {
                onSuccess: () => {
                    toast.success('Role updated successfully!');
                    setEditOpen(false);
                    setIsUpdating(false);
                    setEditRole(null);
                },
                onError: () => {
                    setIsUpdating(false);
                    toast.error('Failed to update role.');
                },
                onFinish: () => {
                    setIsUpdating(false);
                },
            },
        );
    };

    const handleDelete = (role: Role) => {
        setSelectedRole(role);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedRole) return;
        setIsDeleting(true);

        router.delete(route('roles.destroy', selectedRole.id), {
            onSuccess: () => {
                toast.success('Role deleted successfully!', {
                    description: `${selectedRole.name} has been removed.`,
                });
                setDeleteOpen(false);
                setSelectedRole(null);
            },
            onError: () => {
                toast.error('Failed to delete role.');
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="min-h-screen dark:bg-gray-950">
                <div className="container mx-auto space-y-4 p-4 md:p-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-2xl font-bold text-sky-950 md:text-3xl dark:text-white">
                                <Notebook className="h-6 w-6 md:h-8 md:w-8" />
                                Manage Roles
                            </h1>
                            <p className="mt-1 text-sm text-sky-900 dark:text-sky-100">
                                {roles.length} role{roles.length !== 1 ? 's' : ''} total
                            </p>
                        </div>

                        <Button
                            onClick={() => setOpen(true)}
                            className="w-full bg-sky-400 text-sky-950 hover:bg-sky-600 hover:text-white sm:w-auto dark:bg-sky-900 dark:text-sky-50 dark:hover:bg-sky-700"
                        >
                            <SquarePlus className="mr-2 h-4 w-4" />
                            Add Role
                        </Button>
                    </div>

                    {/* Desktop Table View (md and up) */}
                    <div className="hidden md:block">
                        <div className="overflow-hidden rounded-lg border border-sky-200 bg-white shadow-sm dark:border-sky-800 dark:bg-sky-950">
                            <Table>
                                <TableCaption className="text-base font-medium">A list of Roles</TableCaption>

                                <TableHeader>
                                    <TableRow className="bg-sky-400 dark:bg-sky-800">
                                        <TableHead className="w-[60px] font-bold">#</TableHead>
                                        <TableHead className="font-bold">Name</TableHead>
                                        <TableHead className="font-bold">Permissions</TableHead>
                                        <TableHead className="w-[200px] text-center font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {roles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                <p className="text-muted-foreground">No roles found</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        roles.map(({ id, name, permissions }, index) => (
                                            <TableRow key={id} className="hover:bg-sky-100/50 dark:hover:bg-sky-800/50">
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell className="font-medium capitalize">{name}</TableCell>
                                                <TableCell>
                                                    {permissions.length ? (
                                                        <div className="flex max-w-full flex-wrap gap-1.5">
                                                            {permissions.map((permission) => (
                                                                <span
                                                                    key={permission.id}
                                                                    className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-100"
                                                                >
                                                                    {permission.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground italic">No permissions</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link href={route('roles.show', id)}>
                                                            <Button size="icon" variant="outline" className="h-8 w-8">
                                                                <View className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        {can('roles.edit') && (
                                                            <Button
                                                                onClick={() => handleEditClick({ id, name, permissions })}
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-8 w-8"
                                                            >
                                                                <UserPen className="h-4 w-4" />
                                                            </Button>
                                                        )}

                                                        <Button
                                                            onClick={() => handleDelete({ id, name, permissions })}
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
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
                        {roles.length === 0 ? (
                            <Card className="border-sky-200 bg-white dark:border-sky-800 dark:bg-sky-900">
                                <CardContent className="flex h-32 items-center justify-center">
                                    <p className="text-muted-foreground">No roles found</p>
                                </CardContent>
                            </Card>
                        ) : (
                            roles.map(({ id, name, permissions }, index) => (
                                <Card key={id} className="overflow-hidden border-sky-200 bg-white dark:border-sky-800 dark:bg-sky-900">
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            {/* Role Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600 dark:bg-sky-800 dark:text-sky-300">
                                                            {index + 1}
                                                        </span>
                                                        <h3 className="font-semibold capitalize">{name}</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Permissions */}
                                            <div>
                                                <p className="mb-2 text-xs font-medium text-muted-foreground">Permissions:</p>
                                                {permissions.length ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {permissions.map((permission) => (
                                                            <span
                                                                key={permission.id}
                                                                className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-100"
                                                            >
                                                                {permission.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground italic">No permissions assigned</span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-2">
                                                <Link href={route('roles.show', id)} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <View className="mr-2 h-4 w-4" />
                                                        View
                                                    </Button>
                                                </Link>

                                                {can('roles.edit') && (
                                                    <Button
                                                        onClick={() => handleEditClick({ id, name, permissions })}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                    >
                                                        <UserPen className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                )}

                                                <Button
                                                    onClick={() => handleDelete({ id, name, permissions })}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Empty State */}
                    {roles.length === 0 && (
                        <div className="mt-8 text-center">
                            <p className="text-sm text-muted-foreground">Get started by adding your first role</p>
                            <Button
                                onClick={() => setOpen(true)}
                                className="mt-4 bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700"
                            >
                                <SquarePlus className="mr-2 h-4 w-4" />
                                Add Role
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Role Modal */}
            <ModalForm
                open={open}
                onOpenChange={setOpen}
                title="Add New Role"
                description="Fill in the details to create a new role."
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                setRoleName('');
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            className="bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700"
                            type="submit"
                            form="addRoleForm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </>
                }
            >
                <form id="addRoleForm" onSubmit={handleAddRole} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="e.g. Barangay Secretary"
                            required
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>
                </form>
            </ModalForm>

            {/* Edit Role Modal */}
            <ModalForm
                open={editOpen}
                onOpenChange={setEditOpen}
                title="Edit Role"
                description="Update the role details below."
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setEditOpen(false);
                                setEditRole(null);
                            }}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700"
                            type="submit"
                            form="editRoleForm"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update'}
                        </Button>
                    </>
                }
            >
                <form id="editRoleForm" onSubmit={handleUpdateRole} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="e.g. Barangay Treasurer"
                            required
                            disabled={isUpdating}
                            autoFocus
                        />
                    </div>
                </form>
            </ModalForm>

            {/* Delete Confirmation Modal */}
            <ModalForm
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Role"
                description={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteOpen(false);
                                setSelectedRole(null);
                            }}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button className="bg-red-600 text-white hover:bg-red-700" onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </>
                }
            >
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    This will permanently remove the role and all of its assigned permissions.
                    <br />
                    Please confirm to continue.
                </div>
            </ModalForm>
        </AppLayout>
    );
}
