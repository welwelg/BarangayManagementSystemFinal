import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { toast } from '@/lib/toast';
import { allNavItems } from '@/navItems';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Crown, Plus, Save, Shield, Sparkles, Trash2, UserCog, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Manage Permission', href: '/permission' }];

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Props {
    permissions: Record<string, Permission[]>;
    roles: Role[];
}

const getSectionForNavItem = (href: string) => {
    if (href.startsWith('/admin/')) return 'Admin';
    if (href.startsWith('/residentuser/')) return 'Resident User';

    return 'System Management';
};

const getDisplayInfoByResource = (resourceName: string) => {
    const navItem = allNavItems.find((item) => item.resource === resourceName);
    return {
        title: navItem?.title || resourceName,
        icon: navItem?.icon,
        section: navItem ? getSectionForNavItem(navItem.href) : 'Other',
    };
};

export default function Index({ permissions, roles }: Props) {
    const safeRoles: Role[] = Array.isArray(roles) ? roles : [];
    const [selectedRole, setSelectedRole] = useState<Role | null>(safeRoles.length > 0 ? safeRoles[0] : null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(safeRoles.length > 0 ? safeRoles[0].permissions.map((p) => p.name) : []);
    const [newPermission, setNewPermission] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const groupedBySection = () => {
        const sections: Record<string, Record<string, Permission[]>> = {
            'System Management': {},
            Admin: {},
            'Resident User': {},
            Other: {},
        };

        Object.entries(permissions).forEach(([resource, perms]) => {
            const displayInfo = getDisplayInfoByResource(resource);
            const section = displayInfo.section;

            if (!sections[section]) {
                sections[section] = {};
            }

            sections[section][resource] = perms;
        });

        return sections;
    };

    const sectionedPermissions = groupedBySection();

    const handleRoleChange = (role: Role) => {
        setSelectedRole(role);
        setSelectedPermissions(role.permissions.map((p) => p.name));
    };

    const togglePermission = (permissionName: string) => {
        setSelectedPermissions((prev) => (prev.includes(permissionName) ? prev.filter((p) => p !== permissionName) : [...prev, permissionName]));
    };

    const toggleResourcePermissions = (resource: string) => {
        const resourcePerms = permissions[resource].map((p) => p.name);
        const allSelected = resourcePerms.every((p) => selectedPermissions.includes(p));

        if (allSelected) {
            setSelectedPermissions((prev) => prev.filter((p) => !resourcePerms.includes(p)));
        } else {
            setSelectedPermissions((prev) => [...new Set([...prev, ...resourcePerms])]);
        }
    };

    const toggleSectionPermissions = (sectionPerms: Record<string, Permission[]>) => {
        const allPerms = Object.values(sectionPerms)
            .flat()
            .map((p) => p.name);
        const allSelected = allPerms.every((p) => selectedPermissions.includes(p));

        if (allSelected) {
            setSelectedPermissions((prev) => prev.filter((p) => !allPerms.includes(p)));
        } else {
            setSelectedPermissions((prev) => [...new Set([...prev, ...allPerms])]);
        }
    };

    const savePermissions = () => {
        if (!selectedRole) return;

        router.post(
            route('permission.update-role', selectedRole.id),
            { permissions: selectedPermissions },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Permissions updated for ${selectedRole.name}!`),
                onError: () => toast.error('Failed to update permissions'),
            },
        );
    };

    const generateFromNavigation = () => {
        const navigationItems = allNavItems.map((item) => ({
            resource: item.resource,
            actions: item.actions,
            title: item.title,
        }));

        setIsGenerating(true);

        router.post(
            route('permission.generate'),
            { navigation_items: navigationItems },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Permissions generated from navigation!');
                    setIsGenerating(false);
                },
                onError: () => {
                    toast.error('Failed to generate permissions');
                    setIsGenerating(false);
                },
            },
        );
    };

    const createPermission = () => {
        if (!newPermission) return;

        router.post(
            route('permission.store'),
            { name: newPermission },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Permission created!');
                    setNewPermission('');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to create permission');
                },
            },
        );
    };

    const deletePermission = (permission: Permission) => {
        if (!confirm(`Delete permission "${permission.name}"? This will remove it from all roles.`)) return;

        router.delete(route('permission.destroy', permission.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Permission deleted!'),
            onError: () => toast.error('Failed to delete permission'),
        });
    };

    const getSectionIcon = (section: string) => {
        switch (section) {
            case 'System Management':
                return Crown;
            case 'Admin':
                return UserCog;
            case 'Resident User':
                return Users;
            default:
                return Shield;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Permissions" />

            <div className="container mx-auto min-h-screen space-y-6 p-6 dark:bg-gray-950">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold text-sky-950 dark:text-white">
                            <Shield className="h-8 w-8 text-sky-950 dark:text-white" />
                            Manage Permissions
                        </h1>
                        <p className="mt-1 text-sky-950 dark:text-white">Control which roles have access to features</p>
                    </div>
                    <Button
                        className="border border-sky-500 bg-linear-to-r from-sky-200 to-sky-300 text-sky-950 hover:from-sky-300 hover:to-sky-400 hover:text-white dark:from-sky-700 dark:to-sky-900 dark:text-white dark:hover:from-sky-600 dark:hover:to-sky-800"
                        onClick={generateFromNavigation}
                        disabled={isGenerating}
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isGenerating ? 'Generating...' : 'Generate from Navigation'}
                    </Button>
                </div>

                <Alert className="bg-sky-300 dark:bg-sky-950">
                    <AlertDescription className="text-sky-950 dark:text-white">
                        💡 <strong>Tip:</strong> Select a role, check the permissions you want to grant, then click <strong>Save</strong>.
                    </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sky-950 dark:text-white">Roles</CardTitle>
                            <CardDescription className="text-sky-900 dark:text-slate-400">Select a role to manage</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleChange(role)}
                                    className={`w-full rounded-lg px-4 py-3 text-left transition ${
                                        selectedRole?.id === role.id
                                            ? 'border border-sky-500 bg-sky-300 text-sky-950 dark:bg-sky-700 dark:text-white'
                                            : 'hover:bg-sky-300 hover:text-white dark:hover:bg-sky-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium capitalize">{role.name}</span>
                                        <Badge variant="secondary">{role.permissions.length}</Badge>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="flex h-[80vh] flex-col overflow-hidden lg:col-span-3">
                        <CardHeader>
                            <div className="flex items-center justify-between text-sky-950 dark:text-white">
                                <div>
                                    <CardTitle className="capitalize">Permissions for {selectedRole?.name}</CardTitle>
                                    <CardDescription className="text-sky-900 dark:text-slate-400">
                                        {selectedPermissions.length} permissions selected
                                    </CardDescription>
                                </div>
                                <Button
                                    className="border border-sky-500 bg-sky-400 text-sky-950 hover:bg-sky-600 hover:text-white dark:bg-sky-700 dark:text-white dark:hover:bg-sky-600"
                                    onClick={savePermissions}
                                    disabled={!selectedRole}
                                >
                                    <Save className="mr-2 h-4 w-4 text-sky-950 dark:text-white" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 space-y-8 overflow-y-auto pr-4">
                            {Object.keys(permissions).length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">No permissions yet. Click "Generate from Navigation".</div>
                            ) : (
                                Object.entries(sectionedPermissions).map(([section, sectionPerms]) => {
                                    if (Object.keys(sectionPerms).length === 0) return null;

                                    const SectionIcon = getSectionIcon(section);
                                    const allSectionPerms = Object.values(sectionPerms)
                                        .flat()
                                        .map((p) => p.name);
                                    const allSectionSelected = allSectionPerms.every((p) => selectedPermissions.includes(p));

                                    return (
                                        <div key={section} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <SectionIcon className="h-6 w-6 text-primary" />
                                                    <h2 className="text-xl font-bold">{section}</h2>
                                                </div>
                                                <Button
                                                    className="border border-sky-400 bg-sky-400 text-sky-950 hover:bg-sky-400 hover:text-white dark:bg-sky-700 dark:text-white dark:hover:bg-sky-800"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleSectionPermissions(sectionPerms)}
                                                >
                                                    {allSectionSelected ? 'Deselect All' : 'Select All'}
                                                </Button>
                                            </div>

                                            <div className="space-y-3 pl-8">
                                                {Object.entries(sectionPerms).map(([resource, perms]) => {
                                                    const resourcePerms = perms.map((p) => p.name);
                                                    const allSelected = resourcePerms.every((p) => selectedPermissions.includes(p));
                                                    const displayInfo = getDisplayInfoByResource(resource);
                                                    const Icon = displayInfo.icon;

                                                    return (
                                                        <div
                                                            key={resource}
                                                            className="space-y-3 rounded-lg border border-sky-200 bg-linear-to-l from-sky-100 to-sky-200 p-4 dark:border-sky-700 dark:from-sky-800 dark:to-sky-950"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="flex items-center gap-2 font-semibold text-sky-950 dark:text-white">
                                                                    {Icon && <Icon className="h-4 w-4 text-sky-950 dark:text-white" />}
                                                                    {displayInfo.title}
                                                                </h3>
                                                                <Button
                                                                    className="border border-sky-500 bg-sky-400 text-sky-950 hover:bg-sky-400 hover:text-white dark:border-sky-700 dark:bg-sky-700 dark:text-white dark:hover:bg-sky-800"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => toggleResourcePermissions(resource)}
                                                                >
                                                                    {allSelected ? 'Deselect All' : 'Select All'}
                                                                </Button>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                                                {perms.map((permission) => {
                                                                    const action = permission.name.split('.').pop() || '';
                                                                    return (
                                                                        <div
                                                                            key={permission.id}
                                                                            className="flex items-center justify-between space-x-2"
                                                                        >
                                                                            <div className="flex items-center space-x-2">
                                                                                <Checkbox
                                                                                    className="border border-sky-950 dark:border-white"
                                                                                    id={permission.name}
                                                                                    checked={selectedPermissions.includes(permission.name)}
                                                                                    onCheckedChange={() => togglePermission(permission.name)}
                                                                                />
                                                                                <Label
                                                                                    htmlFor={permission.name}
                                                                                    className="cursor-pointer text-sm text-sky-950 capitalize dark:text-white"
                                                                                >
                                                                                    {action}
                                                                                </Label>
                                                                            </div>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-8"
                                                                                onClick={() => deletePermission(permission)}
                                                                            >
                                                                                <Trash2 className="h-6 w-3 text-destructive dark:text-white" />
                                                                            </Button>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {section !== 'Other' && <Separator className="my-4" />}
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Custom Permission</CardTitle>
                        <CardDescription>
                            Add a new permission manually (format: <code>resource.action</code>)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., reports.export"
                                value={newPermission}
                                onChange={(e) => setNewPermission(e.target.value.toLowerCase())}
                            />
                            <Button
                                className="bg-sky-400 text-white hover:bg-sky-600 hover:text-white dark:bg-sky-700 dark:hover:bg-sky-800"
                                onClick={createPermission}
                                disabled={!newPermission}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Create
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
