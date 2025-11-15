import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import { messageListener } from '@/lib/message-listener';

export default function MessageDebugger() {
    const [echoStatus, setEchoStatus] = useState<'unknown' | 'connected' | 'disconnected' | 'error'>('unknown');
    const [isListening, setIsListening] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        // Check Echo status
        const checkEchoStatus = () => {
            if (!window.Echo) {
                setEchoStatus('error');
                return;
            }

            const pusher = window.Echo.connector.pusher;
            if (pusher && pusher.connection) {
                const state = pusher.connection.state;
                if (state === 'connected') {
                    setEchoStatus('connected');
                } else if (state === 'disconnected') {
                    setEchoStatus('disconnected');
                } else {
                    setEchoStatus('error');
                }
            } else {
                setEchoStatus('error');
            }
        };

        checkEchoStatus();
        const interval = setInterval(checkEchoStatus, 2000);

        return () => clearInterval(interval);
    }, []);

    const testToast = () => {
        toast.info('Test Message', {
            description: 'This is a test message to verify toast notifications are working',
            action: {
                label: 'View',
                onClick: () => console.log('Toast action clicked'),
            },
            duration: 8000,
        });
    };

    const testMessageListener = () => {
        if (!userId) {
            toast.error('Please enter a user ID first');
            return;
        }

        if (isListening) {
            messageListener.stopListening();
            setIsListening(false);
            toast.info('Stopped listening for messages');
        } else {
            messageListener.startListening(userId);
            setIsListening(true);
            toast.success(`Started listening for user ${userId}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return 'bg-green-500';
            case 'disconnected': return 'bg-yellow-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Message System Debugger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Echo Status:</span>
                    <Badge className={getStatusColor(echoStatus)}>
                        {echoStatus.toUpperCase()}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Listening:</span>
                    <Badge variant={isListening ? 'default' : 'secondary'}>
                        {isListening ? 'YES' : 'NO'}
                    </Badge>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">User ID:</label>
                    <input
                        type="number"
                        value={userId || ''}
                        onChange={(e) => setUserId(parseInt(e.target.value) || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter user ID to test"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button onClick={testToast} variant="outline">
                        Test Toast
                    </Button>
                    <Button 
                        onClick={testMessageListener} 
                        variant={isListening ? 'destructive' : 'default'}
                        disabled={!userId}
                    >
                        {isListening ? 'Stop Listening' : 'Start Listening'}
                    </Button>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Check browser console for detailed logs</p>
                    <p>• Make sure Pusher credentials are configured in .env</p>
                    <p>• Test with different user IDs to simulate message sending</p>
                </div>
            </CardContent>
        </Card>
    );
}
