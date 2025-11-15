import { messageListener } from './message-listener';

// Test function to simulate a message event
export function testMessageNotification() {
    const testData = {
        id: 999,
        sender_id: 1,
        recipient_id: 2,
        body: 'This is a test message to verify toast notifications are working properly!',
        is_read: false,
        sender_type: 'admin',
        created_at: new Date().toISOString(),
        sender: {
            id: 1,
            name: 'Test Admin',
            email: 'admin@test.com',
        },
    };

    // Simulate the message event
    
    // We can't directly call the private method, but we can test the toast functionality
    // by importing and using the toast directly
    import('./toast').then(({ toast }) => {
        toast.info('Test Message Received', {
            description: `${testData.sender.name}: ${testData.body.substring(0, 50)}...`,
            action: {
                label: 'View',
                onClick: () => {},
            },
            duration: 8000,
        });
    });
}

// Test function to simulate a broadcast message event
export function testBroadcastNotification() {
    const testData = {
        id: 998,
        sender_id: 1,
        recipient_id: 2,
        body: 'This is a test broadcast message to verify toast notifications are working properly!',
        is_read: false,
        sender_type: 'admin',
        created_at: new Date().toISOString(),
        sender: {
            id: 1,
            name: 'Test Admin',
            email: 'admin@test.com',
        },
    };

    // Simulate the broadcast message event
    
    import('./toast').then(({ toast }) => {
        toast.info('Test Broadcast Message Received', {
            description: `${testData.sender.name}: ${testData.body.substring(0, 50)}...`,
            action: {
                label: 'View',
                onClick: () => {},
            },
            duration: 8000,
        });
    });
}

// Make it available globally for testing
if (typeof window !== 'undefined') {
    (window as any).testMessageNotification = testMessageNotification;
    (window as any).testBroadcastNotification = testBroadcastNotification;
}
