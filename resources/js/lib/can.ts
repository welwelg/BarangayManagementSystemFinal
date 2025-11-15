import { usePage } from '@inertiajs/react';

export function can(permission: string): boolean {
    const { auth } = usePage().props as {
        auth?: {
            user?: {
                permissions?: string[];
            } | null;
        };
    };

    return auth?.user?.permissions?.includes(permission) ?? false;
}
