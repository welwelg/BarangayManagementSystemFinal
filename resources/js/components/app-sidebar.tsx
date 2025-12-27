import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { type NavItem } from '@/types';
import { CloudRainWind, FolderKanban, LayoutDashboard, Megaphone, MessageSquareWarning, Notebook, TriangleAlert, Users } from 'lucide-react';
import { AiFillMessage } from 'react-icons/ai';
import { LuShieldEllipsis } from 'react-icons/lu';
import AppLogo from './app-logo';
import { ClipboardList } from 'lucide-react';

// All navigation items with roles
const allNavItems: NavItem[] = [
    // SuperAdmin only items
    // {
    //     title: 'Super Admin Dashboard',
    //     href: '/dashboard',
    //     icon: LayoutGrid,
    //     roles: ['superadmin'], // Only SuperAdmin can see this
    // },

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
        roles: ['superadmin'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'permissions',
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
    {
        title: 'Blotter',
        href: '/admin/blotter',
        icon: ClipboardList,
        roles: ['admin', 'superadmin'],
        actions: ['view', 'create', 'edit', 'delete'],
        resource: 'blotter',
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
     {
            title: 'Blotter',
            href: '/residentuser/blotter',
            icon: ClipboardList,
            roles: ['user'],
            actions: ['view', 'create', 'edit', 'delete'],
            resource: 'residentuser-blotter',
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { hasAnyRole } = useAuth();

    // Filter navigation items based on user roles
    const filteredNavItems = allNavItems.filter((item) => {
        // If no roles specified, show to everyone (authenticated)
        if (!item.roles || item.roles.length === 0) {
            return true;
        }

        // Check if user has any of the required roles
        return hasAnyRole(item.roles);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="group flex items-center gap-3 px-3 py-2 transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
