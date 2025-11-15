import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

export default function ToastTest() {
    const testToast = (type: 'success' | 'error' | 'info' | 'warning') => {
        switch (type) {
            case 'success':
                toast.success('This is a success message!');
                break;
            case 'error':
                toast.error('This is an error message!');
                break;
            case 'info':
                toast.info('This is an info message!');
                break;
            case 'warning':
                toast.warning('This is a warning message!');
                break;
        }
    };

    const testMessageNotification = () => {
        if (typeof window !== 'undefined' && (window as any).testMessageNotification) {
            (window as any).testMessageNotification();
        } else {
            toast.info('Test Message', {
                description: 'This is a test message notification',
                action: {
                    label: 'View',
                    onClick: () => {},
                },
            });
        }
    };

    const testBroadcastNotification = () => {
        if (typeof window !== 'undefined' && (window as any).testBroadcastNotification) {
            (window as any).testBroadcastNotification();
        } else {
            toast.info('Test Broadcast Message', {
                description: 'This is a test broadcast message notification',
                action: {
                    label: 'View',
                    onClick: () => {},
                },
            });
        }
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex flex-wrap gap-2">
                <Button onClick={() => testToast('success')} variant="default">
                    Test Success Toast
                </Button>
                <Button onClick={() => testToast('error')} variant="destructive">
                    Test Error Toast
                </Button>
                <Button onClick={() => testToast('info')} variant="outline">
                    Test Info Toast
                </Button>
                <Button onClick={() => testToast('warning')} variant="secondary">
                    Test Warning Toast
                </Button>
            </div>
            
            <div className="border-t pt-4">
                <h3 className="mb-2 text-sm font-medium">Message Notifications</h3>
                <div className="flex flex-wrap gap-2">
                    <Button onClick={testMessageNotification} variant="outline">
                        Test Message Notification
                    </Button>
                    <Button onClick={testBroadcastNotification} variant="outline">
                        Test Broadcast Notification
                    </Button>
                </div>
            </div>
        </div>
    );
}
