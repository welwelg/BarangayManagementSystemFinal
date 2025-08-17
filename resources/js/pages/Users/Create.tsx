import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CircleX } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add Users',
        href: '/users',
    },
];

export default function Create({ roles }) {
    const { flash } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        floating_name: '',
        floating_email: '',
        floating_password: '',
        floating_repeat_password: '',
        roles: [],
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add User" />
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
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
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
                                required
                            />
                            <label
                                htmlFor="floating_password"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Password
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
                                required
                            />
                            <label
                                htmlFor="floating_repeat_password"
                                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
                            >
                                Confirm password
                            </label>
                            {errors.floating_repeat_password && <div className="mt-1 text-sm text-red-600">{errors.floating_repeat_password}</div>}
                        </div>

                        {/* Roles */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</label>
                            {roles.map((role) => (
                                <div className="flex flex-col space-y-2">
                                    {can('roles.create') && (
                                        <label key={roles} className="flex items-center space-x-2">
                                            <input
                                                onChange={(e) => handleCheckboxChange(role, e.target.checked)}
                                                type="checkbox"
                                                id={role}
                                                value={role}
                                                className="form-checkbox h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">{role}</span>
                                        </label>
                                    )}
                                </div>
                            ))}

                            {errors.roles && <div className="mt-1 text-sm text-red-600">{errors.roles}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:opacity-50 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {processing ? 'Creating...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
