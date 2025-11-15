import { toast as sonnerToast } from 'sonner';

export const toast = {
    success: (message: string, options?: any) => {
        return sonnerToast.success(message, {
            duration: 5000,
            ...options,
        });
    },
    
    error: (message: string, options?: any) => {
        return sonnerToast.error(message, {
            duration: 5000,
            ...options,
        });
    },
    
    info: (message: string, options?: any) => {
        return sonnerToast.info(message, {
            duration: 5000,
            ...options,
        });
    },
    
    warning: (message: string, options?: any) => {
        return sonnerToast.warning(message, {
            duration: 5000,
            ...options,
        });
    },
    
    loading: (message: string, options?: any) => {
        return sonnerToast.loading(message, {
            duration: 0, // Loading toasts don't auto-dismiss
            ...options,
        });
    },
    
    dismiss: (toastId?: string | number) => {
        return sonnerToast.dismiss(toastId);
    },
    
    promise: <T>(
        promise: Promise<T>,
        {
            loading,
            success,
            error,
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return sonnerToast.promise(promise, {
            loading,
            success,
            error,
        });
    },
};

export default toast;
