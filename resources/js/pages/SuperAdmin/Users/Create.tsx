import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { toast } from '@/lib/toast';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FolderKanban } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Add Users', href: '/users' }];

export default function Create({ roles }) {
    const { residents } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        floating_name: residents ? `${residents.first_name} ${residents.middle_name ?? ''} ${residents.last_name}`.trim() : '',
        floating_email: residents?.email ?? '',
        floating_password: '',
        floating_repeat_password: '',
        roles: [],
    });

    const handleCheckboxChange = (roleName: string, checked: boolean) => {
        setData('roles', checked ? [...data.roles, roleName] : data.roles.filter((r) => r !== roleName));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                toast.success('User created successfully!');
            },
            onError: () => {
                toast.error('Failed to create user.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add User" />

            <div className="flex justify-center p-4">
                <Card className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                            <FolderKanban className="h-8 w-8" />
                            Add Users
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto pr-2">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="floating_name">Name</Label>
                                <Input
                                    id="floating_name"
                                    type="text"
                                    value={data.floating_name}
                                    onChange={(e) => setData('floating_name', e.target.value)}
                                    required
                                />
                                {errors.floating_name && <p className="text-sm text-red-600">{errors.floating_name}</p>}
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="floating_email">Email</Label>
                                <Input
                                    id="floating_email"
                                    type="email"
                                    value={data.floating_email}
                                    onChange={(e) => setData('floating_email', e.target.value)}
                                    required
                                />
                                {errors.floating_email && <p className="text-sm text-red-600">{errors.floating_email}</p>}
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="floating_password">Password</Label>
                                <Input
                                    id="floating_password"
                                    type="password"
                                    value={data.floating_password}
                                    onChange={(e) => setData('floating_password', e.target.value)}
                                    required
                                />
                                {errors.floating_password && <p className="text-sm text-red-600">{errors.floating_password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="floating_repeat_password">Confirm Password</Label>
                                <Input
                                    id="floating_repeat_password"
                                    type="password"
                                    value={data.floating_repeat_password}
                                    onChange={(e) => setData('floating_repeat_password', e.target.value)}
                                    required
                                />
                                {errors.floating_repeat_password && <p className="text-sm text-red-600">{errors.floating_repeat_password}</p>}
                            </div>

                            {/* Roles */}
                            <div className="grid gap-2">
                                <Label>Permissions</Label>
                                <div className="flex flex-col space-y-2">
                                    {roles.map((role) => (
                                        <label key={role} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={data.roles.includes(role)}
                                                onChange={(e) => handleCheckboxChange(role, e.target.checked)}
                                                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>{role}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.roles && <p className="text-sm text-red-600">{errors.roles}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Submit'}
                                </Button>

                                <Link href={route('users.index')}>
                                    <Button variant="outline">Cancel</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
