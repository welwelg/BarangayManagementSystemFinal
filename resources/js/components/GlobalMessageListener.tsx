import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { messageListener } from '@/lib/message-listener';

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: AuthUser;
    };
}

export default function GlobalMessageListener() {
    const { auth } = usePage<PageProps>().props;

    useEffect(() => {
        if (!auth?.user?.id) {
            return;
        }

        // Start listening for messages
        messageListener.startListening(auth.user.id);

        // Request notification permission
        messageListener.requestNotificationPermission();

        return () => {
            messageListener.stopListening();
        };
    }, [auth?.user?.id]);

    return null; // This component doesn't render anything
}
