import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CircleX } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'View User',
        href: '/users',
    },
];

export default function Show({ user, userRoles }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View User" />
            <div className="m-3">
                <Link href={route('users.index')}>
                    <CircleX className="size-8 rounded-2xl bg-red-500 text-amber-50 hover:bg-red-700" />
                </Link>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="w-8/12 p-4">
                    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
                        <div className="bg-gray-100 p-4 dark:bg-gray-800">
                            <h2 className="text-lg font-semibold">User Information</h2>
                        </div>
                        <div className="space-y-4 p-4 text-gray-800 dark:text-gray-200">
                            <p>
                                <strong className="text-xl">Name:</strong> {user.name}
                            </p>
                            <p>
                                <strong className="text-xl">Email:</strong> {user.email}
                            </p>
                            <p>
                                <strong className="text-xl">Roles:</strong>
                                <div className="mt-2 flex flex-wrap gap-5">
                                    {userRoles.length > 0 ? (
                                        userRoles.map((role: string) => (
                                            <span
                                                key={role}
                                                className="text-l rounded bg-green-100 px-3 py-1 font-medium text-green-800 dark:bg-green-800 dark:text-green-100"
                                            >
                                                {role}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic dark:text-gray-400">No roles assigned</span>
                                    )}
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
