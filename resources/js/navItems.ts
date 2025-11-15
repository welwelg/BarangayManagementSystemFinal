import { type NavItem } from '@/types';
import { CloudRainWind, FolderKanban, LayoutDashboard, Megaphone, MessageSquareWarning, Notebook, TriangleAlert, Users } from 'lucide-react';
import { AiFillMessage } from 'react-icons/ai';
import { LuShieldEllipsis } from 'react-icons/lu';

export const allNavItems: NavItem[] = [
    // System Management (SuperAdmin/Admin items)
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        roles: ['admin', 'superadmin'],
        actions: ['view'],
        resource: 'admin-dashboard',
    },
    {
        title: 'Manage Users',
        href: '/users',
        icon: FolderKanban,
        roles: ['superadmin', 'admin'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'users',
    },
    {
        title: 'Manage Permission',
        href: '/permission',
        icon: LuShieldEllipsis,
        roles: [ 'superadmin'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'permission',
    },
    {
        title: 'Manage Roles',
        href: '/roles',
        icon: Notebook,
        roles: ['superadmin'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'roles',
    },

    // Admin items

    {
        title: 'Typhoon Monitoring',
        href: '/admin/typhoon-monitoring',
        icon: CloudRainWind,
        roles: ['admin', 'superadmin'],
        actions: ['view'],
        resource: 'admin-dashboard',
    },
    {
        title: 'Message',
        href: '/admin/message',
        icon: AiFillMessage,
        roles: ['admin', 'superadmin'],
        actions: ['view', 'create', 'delete'],
        resource: 'message',
    },
    {
        title: 'Residents',
        href: '/admin/residents',
        icon: Users,
        roles: ['admin', 'superadmin'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'residents',
    },
    {
        title: 'Announcements',
        href: '/admin/announcements',
        icon: Megaphone,
        roles: ['admin', 'superadmin'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'announcements',
    },
    {
        title: 'Complaints',
        href: '/admin/complaints',
        icon: MessageSquareWarning,
        roles: ['admin', 'superadmin'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'complaints',
    },
    {
        title: 'Disaster Reports',
        href: '/admin/disaster-reports',
        icon: TriangleAlert,
        roles: ['admin', 'superadmin'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'disaster-reports',
    },

    // Resident User items
    {
        title: 'Resident Dashboard',
        href: '/residentuser/dashboard',
        icon: LayoutDashboard,
        roles: ['user'],
        actions: ['view'],
        resource: 'resident-dashboard',
    },
    {
        title: 'Typhoon Monitoring',
        href: '/residentuser/typhoon-monitoring',
        icon: CloudRainWind,
        roles: ['user'],
        actions: ['view'],
        resource: 'residentuser-typhoon-monitoring',
    },
    {
        title: 'Message',
        href: '/residentuser/message',
        icon: AiFillMessage,
        roles: ['user'],
        actions: ['view', 'create', 'delete'],
        resource: 'residentuser-message',
    },
    {
        title: 'Announcements',
        href: '/residentuser/announcements',
        icon: Megaphone,
        roles: ['user'],
        actions: ['view'],
        resource: 'residentuser-announcements',
    },
    {
        title: 'Complaints',
        href: '/residentuser/complaints',
        icon: MessageSquareWarning,
        roles: ['user'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'residentuser-complaints',
    },
    {
        title: 'Disaster Reports',
        href: '/residentuser/disaster-reports',
        icon: TriangleAlert,
        roles: ['user'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'residentuser-disaster-reports',
    },
];
