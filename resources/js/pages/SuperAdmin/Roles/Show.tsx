import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CircleX } from 'lucide-react';

type ShowProps = {
    role: { id: number; name: string };
    permissions: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Show Roles',
        href: '/roles',
    },
];

export default function Show({ role, permissions }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Roles" />

            {/* Back Button */}
            <div className="m-3">
                <Link href={route('roles.index')}>
                    <CircleX className="size-8 rounded-2xl bg-red-500 text-amber-50 hover:bg-red-700" />
                </Link>
            </div>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="w-8/12 p-4">
                    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
                        {/* Header */}
                        <div className="bg-gray-100 p-4 dark:bg-gray-800">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Roles</h2>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 p-4 text-gray-800 dark:text-gray-200">
                            <p className="text-xl">
                                <strong>Name:</strong> {role.name}
                            </p>
                            <div className="text-xl">
                                <strong>Permissions:</strong>
                                <div className="mt-2 flex flex-wrap gap-5">
                                    {permissions.length > 0 ? (
                                        permissions.map((permission) => (
                                            <span
                                                key={permission}
                                                className="text-l rounded bg-green-100 px-3 py-1 font-medium text-green-800 dark:bg-green-800 dark:text-green-100"
                                            >
                                                {permission}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 italic dark:text-gray-400">No permissions assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
