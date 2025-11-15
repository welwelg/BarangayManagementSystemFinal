import { toast } from './toast';
import { router } from '@inertiajs/react';

import { route } from 'ziggy-js';

interface MessageEventData {
    id: number;
    sender_id: number;
    recipient_id: number;
    body: string;
    is_read: boolean;
    sender_type: string;
    created_at: string;
    sender: {
        id: number;
        name: string;
        email: string;
    };
}

export class MessageListener {
    private static instance: MessageListener;
    private isListening = false;
    private currentUserId: number | null = null;

    public static getInstance(): MessageListener {
        if (!MessageListener.instance) {
            MessageListener.instance = new MessageListener();
        }
        return MessageListener.instance;
    }

    public startListening(userId: number): void {
        if (this.isListening && this.currentUserId === userId) {
            return; // Already listening for this user
        }

        this.stopListening(); // Stop previous listener if any
        this.currentUserId = userId;
        this.isListening = true;

        if (!window.Echo) {
            return; // Echo not available
        }

        try {
            const channelName = `user.${userId}`;
            const channel = window.Echo.private(channelName);

            // Listen for the message.sent event
            channel.listen('.message.sent', (data: MessageEventData) => {
                this.handleNewMessage(data);
            });

            // Connection and error listeners (silent)
            channel.subscribed(() => {});
            channel.error(() => {});

            // Listen for any events (silent to prevent ESLint warning)
            channel.listen('*', (_eventName: string, _data: unknown) => {});
        } catch {
            this.isListening = false;
            this.currentUserId = null;
        }
    }

    public stopListening(): void {
        if (!this.isListening || !this.currentUserId) {
            return;
        }

        if (window.Echo) {
            window.Echo.leave(`user.${this.currentUserId}`);
        }

        this.isListening = false;
        this.currentUserId = null;
    }

    private handleNewMessage(data: MessageEventData): void {
        const isBroadcast = data.sender_type === 'admin';

        toast.info(isBroadcast ? 'Broadcast Message Received' : 'New Message Received', {
            description: `${data.sender.name}: ${data.body.substring(0, 50)}${data.body.length > 50 ? '...' : ''}`,
            action: {
                // label:'View', if you want to add a view message in toast notification uncomment the line below
                onClick: () => {
                    const currentPath = window.location.pathname;

                    if (currentPath.includes('/admin/')) {
                        router.visit(route('admin.message.show', { id: data.id }));
                    } else if (currentPath.includes('/residentuser/')) {
                        router.visit(route('residentuser.message.show', { id: data.id }));
                    } else {
                        try {
                            router.visit(route('residentuser.message.show', { id: data.id }));
                        } catch {
                            try {
                                router.visit(route('admin.message.show', { id: data.id }));
                            } catch {
                                router.visit(route('residentuser.message.index'));
                            }
                        }
                    }
                },
            },
            duration: 10000,
            closeButton: true,
        });

        // Refresh UI for message count updates
        router.reload({ only: ['messages', 'unreadCount'] });
    }

    public requestNotificationPermission(): void {
        // No browser notifications
    }
}

// Export singleton instance
export const messageListener = MessageListener.getInstance();
