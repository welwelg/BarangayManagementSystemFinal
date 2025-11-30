import { toast } from 'sonner';

interface MessageEventData {
    id: number;
    sender_id: number;
    sender: {
        id: number;
        name: string;
        email: string;
    };
    body: string;
    created_at: string;
    sender_type?: string;
}

export class MessageListener {
    private static instance: MessageListener;
    private isListening = false;
    private currentUserId: number | null = null;
    private currentChannel: any = null;
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private readonly reconnectDelay = 2000;
    private notificationPermission: NotificationPermission = 'default';

    public static getInstance(): MessageListener {
        if (!MessageListener.instance) {
            MessageListener.instance = new MessageListener();
        }
        return MessageListener.instance;
    }

    public async requestNotificationPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            return false;
        }

        if (Notification.permission === 'granted') {
            this.notificationPermission = 'granted';
            return true;
        }

        if (Notification.permission === 'denied') {
            this.notificationPermission = 'denied';
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission;
            return permission === 'granted';
        } catch (error) {
            return false;
        }
    }

    private showBrowserNotification(title: string, body: string, messageId: number): void {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        try {
            const notification = new Notification(title, {
                body,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `message-${messageId}`,
                requireInteraction: false,
                silent: false,
            });

            notification.onclick = () => {
                window.focus();
                this.navigateToMessage(messageId);
                notification.close();
            };

            setTimeout(() => notification.close(), 10000);
        } catch (error) {
            // Silently fail
        }
    }

    public startListening(userId: number): void {
        if (this.isListening && this.currentUserId === userId) {
            return;
        }

        this.stopListening();
        this.currentUserId = userId;
        this.isListening = true;
        this.reconnectAttempts = 0;

        this.initializeEcho()
            .then(() => {
                if (!window.Echo) {
                    throw new Error('Echo not available after initialization');
                }
                this.setupChannel();
            })
            .catch(() => {
                this.attemptReconnect();
            });
    }

    private async initializeEcho(): Promise<void> {
        if (window.Echo) return Promise.resolve();

        try {
            await import('../echo');
            if (!window.Echo) {
                throw new Error('Echo not properly initialized');
            }
        } catch (error) {
            throw error;
        }
    }

    private setupChannel(): void {
        if (!this.currentUserId || !window.Echo) {
            return;
        }

        const channelName = `user.${this.currentUserId}`;

        try {
            this.currentChannel = window.Echo.private(channelName);

            this.currentChannel
                .listen('.message.sent', (data: MessageEventData) => {
                    this.handleNewMessage(data);
                })
                .error(() => {
                    this.attemptReconnect();
                });
        } catch (error) {
            this.attemptReconnect();
        }
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * this.reconnectAttempts;

        setTimeout(() => {
            if (this.currentUserId) {
                this.startListening(this.currentUserId);
            }
        }, delay);
    }

    public stopListening(): void {
        if (this.currentChannel && window.Echo) {
            try {
                window.Echo.leaveChannel(this.currentChannel.name);
            } catch (error) {
                // Silently fail
            }
        }

        this.currentChannel = null;
        this.isListening = false;
    }

    private handleNewMessage(data: MessageEventData): void {
        try {
            if (!data || !data.sender_id || !data.sender) {
                return;
            }

            if (data.sender_id === this.currentUserId) {
                return;
            }

            const isBroadcast = data.sender_type === 'admin';
            const messagePreview = data.body && data.body.length > 50
                ? `${data.body.substring(0, 50)}...`
                : data.body || 'New message';

            const title = isBroadcast ? '📢 Broadcast Message' : '✉️ New Message';
            const description = `${data.sender.name || 'Someone'}: ${messagePreview}`;

            if (typeof window !== 'undefined') {
                toast.info(title, {
                    description,
                    // action: {
                    //     label: 'View',
                    //     onClick: () => this.navigateToMessage(data.id)
                    // },
                    duration: 10000,
                    id: `message-${data.id}`,
                });
            }

            this.showBrowserNotification(title, description, data.id);
        } catch (error) {
            // Silently fail
        }
    }

    private navigateToMessage(messageId: number): void {
        const path = window.location.pathname;
        if (path.includes('/admin/')) {
            window.location.href = '/admin/message';
        } else {
            window.location.href = '/residentuser/message';
        }
    }

    public getNotificationPermission(): NotificationPermission {
        if ('Notification' in window) {
            return Notification.permission;
        }
        return 'denied';
    }
}

export const messageListener = MessageListener.getInstance();
