import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface ModalFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode; // Para sa form content
    footer?: ReactNode; // Optional footer (buttons)
    size?: 'sm' | 'md' | 'lg'; // Optional size control
}

export function ModalForm({ open, onOpenChange, title, description, children, footer, size = 'md' }: ModalFormProps) {
    const sizeClass = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-3xl' : 'max-w-lg'; // default md

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={sizeClass}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <div className="py-4">{children}</div>

                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}
