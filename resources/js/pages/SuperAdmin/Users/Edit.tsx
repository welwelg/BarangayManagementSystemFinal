import AppLayout from '@/layouts/app-layout';
import { toast } from '@/lib/toast';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleX } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit User',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface EditProps {
    user: User;
    userRoles: string[];
    roles: string[];
}

export default function Edit({ user, userRoles, roles }: EditProps) {
    const { data, setData, put, errors, processing } = useForm({
        floating_name: user.name || '',
        floating_email: user.email || '',
        floating_password: '',
        floating_repeat_password: '',
        roles: userRoles || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.floating_password && !data.floating_repeat_password) {
            alert('⚠️ Please confirm your password.');
            return;
        }

        if (data.floating_password !== data.floating_repeat_password) {
            alert('⚠️ Passwords do not match.');
            return;
        }
        put(route('users.update', user.id), {
            onSuccess: () => {
                toast.success('User updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update user.');
            },
        });
    };
    function handleCheckboxChange(roleName, checked) {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData(
                'roles',
                data.roles.filter((p) => p !== roleName),
            );
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="m-3">
                <Link href={route('users.index')}>
                    <CircleX className="size-8 rounded-2xl bg-red-500 text-amber-50 hover:bg-red-700" />
                </Link>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="w-8/12 p-4">
                    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
                        {/* Name Field */}
                        <div className="group relative z-0 mb-5 w-full">
                            <input
                                type="text"
                                name="floating_name"
                                id="floating_name"
                                value={data.floating_name}
                                onChange={(e) => setData('floating_name', e.target.value)}
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="floating_name"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Name
                            </label>
                            {errors.floating_name && <div className="mt-1 text-sm text-red-600">{errors.floating_name}</div>}
                        </div>

                        {/* Email Field */}
                        <div className="group relative z-0 mb-5 w-full">
                            <input
                                type="email"
                                name="floating_email"
                                id="floating_email"
                                value={data.floating_email}
                                onChange={(e) => setData('floating_email', e.target.value)}
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="floating_email"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Email
                            </label>
                            {errors.floating_email && <div className="mt-1 text-sm text-red-600">{errors.floating_email}</div>}
                        </div>

                        {/* Password Field */}
                        <div className="group relative z-0 mb-5 w-full">
                            <input
                                type="password"
                                name="floating_password"
                                id="floating_password"
                                value={data.floating_password}
                                onChange={(e) => setData('floating_password', e.target.value)}
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                placeholder=" "
                            />
                            <label
                                htmlFor="floating_password"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                New Password (leave blank to keep current)
                            </label>
                            {errors.floating_password && <div className="mt-1 text-sm text-red-600">{errors.floating_password}</div>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="group relative z-0 mb-5 w-full">
                            <input
                                type="password"
                                name="floating_repeat_password"
                                id="floating_repeat_password"
                                value={data.floating_repeat_password}
                                onChange={(e) => setData('floating_repeat_password', e.target.value)}
                                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
                                placeholder=" "
                            />
                            <label
                                htmlFor="floating_repeat_password"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Confirm New Password
                            </label>
                            {errors.floating_repeat_password && <div className="mt-1 text-sm text-red-600">{errors.floating_repeat_password}</div>}
                        </div>

                        {/* Roles */}
                        <div className="mb-5">
                            <>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</label>
                                {roles.map((role) => (
                                    <div key={role} className="flex flex-col space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                checked={data.roles.includes(role)}
                                                onChange={(e) => handleCheckboxChange(role, e.target.checked)}
                                                type="checkbox"
                                                id={role}
                                                value={role}
                                                className="form-checkbox h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">{role}</span>
                                        </label>
                                    </div>
                                ))}

                                {errors.roles && <div className="mt-1 text-sm text-red-600">{errors.roles}</div>}
                            </>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:opacity-50 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {processing ? 'Updating...' : 'Update User'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
