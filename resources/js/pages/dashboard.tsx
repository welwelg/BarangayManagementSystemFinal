import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard() {
    const { props } = usePage();
    const user = props.auth?.user;

    // Assuming roles are included in the user data
    const hasRole = user?.roles && user.roles.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Message if user has no roles */}
                {!hasRole && (
                    <div className="mx-4 mt-4 rounded-lg border border-yellow-400 bg-yellow-100 p-4 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-200">
                        ⚠️ <strong>Notice:</strong> You currently don’t have any assigned role or permissions. Please contact the administrator to
                        assign you a role before you can access all features.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
