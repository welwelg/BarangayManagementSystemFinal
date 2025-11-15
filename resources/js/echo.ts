import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Import test message functionality
import './lib/test-message';

// 🧩 Declare globals for TypeScript
declare global {
    interface Window {
        Pusher: any;
        Echo: any;
        testMessageNotification: () => void;
        testBroadcastNotification: () => void;
    }
}

// 🧩 Attach Pusher to window
window.Pusher = Pusher;

// 🧩 Initialize Echo instance
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],


    authorizer: (channel, _options) => {
        return {
            authorize: (socketId, callback) => {
                fetch('/broadcasting/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        socket_id: socketId,
                        channel_name: channel.name,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => callback(null, data))
                    .catch((error) => {
                        console.error('Broadcasting auth error:', error);
                        // Report the error to the authorizer callback correctly
                        // (previously callback(null, error) incorrectly treated the error as success data)
                        callback(error, null);
                    });
            },
        };
    },
});
// Connection status logging removed
