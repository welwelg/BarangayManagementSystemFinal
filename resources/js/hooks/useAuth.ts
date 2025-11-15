// resources/js/hooks/useAuth.ts
import { usePage } from '@inertiajs/react'

// Define types for the auth structure
interface User {
    id: number
    name: string
    email: string
    roles: string[]
    permissions: string[]
}

interface AuthProps {
    user: User | null
}

interface PageProps {
    auth: AuthProps
}

// Define the hook return type
interface UseAuthReturn {
    user: User | null
    hasRole: (role: string) => boolean
    hasAnyRole: (roles: string[]) => boolean
    hasPermission: (permission: string) => boolean
    isSuperAdmin: () => boolean
    isAdmin: () => boolean
    isResidentUser: () => boolean
    isAdminOrSuperAdmin: () => boolean
}

export function useAuth(): UseAuthReturn {
    const { auth } = usePage<PageProps>().props
    
    const hasRole = (role: string): boolean => {
        return auth.user?.roles?.includes(role) || false
    }
    
    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => hasRole(role))
    }
    
    const hasPermission = (permission: string): boolean => {
        return auth.user?.permissions?.includes(permission) || false
    }
    
    const isSuperAdmin = (): boolean => hasRole('superadmin')
    const isAdmin = (): boolean => hasRole('admin') 
    const isResidentUser = (): boolean => hasRole('residentuser')
    const isAdminOrSuperAdmin = (): boolean => hasAnyRole(['admin', 'superadmin'])
    
    return {
        user: auth.user,
        hasRole,
        hasAnyRole,
        hasPermission,
        isSuperAdmin,
        isAdmin,
        isResidentUser,
        isAdminOrSuperAdmin
    }
}