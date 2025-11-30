import { useEffect, useState, useRef, useCallback } from 'react';

interface TypingIndicatorOptions {
  currentUserId: number;
  otherUserId: number | null;
  enabled?: boolean;
}

interface PresenceChannel {
  name?: string;
  listenForWhisper?: (event: string, callback: (data: any) => void) => void;
  whisper?: (event: string, data: any) => void;
  unsubscribe?: () => void;
  error?: (callback: (error: any) => void) => void;
  listen?: (event: string, callback: (data: any) => void) => void;
}

const TYPING_TIMEOUT = 2000;

export default function useTypingIndicator({
  currentUserId,
  otherUserId,
  enabled = true
}: TypingIndicatorOptions) {
  const [isTyping, setIsTyping] = useState(false);
  const channelRef = useRef<PresenceChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingSentAtRef = useRef<number>(0);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (channelRef.current) {
        channelRef.current.unsubscribe?.();
        channelRef.current = null;
      }
    };
  }, []);

  const handleTypingEvent = useCallback((data: { userId: number }) => {
    if (!isMounted.current || !data || data.userId === currentUserId) return;
    
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setIsTyping(false);
      }
    }, TYPING_TIMEOUT);
  }, [currentUserId]);

  useEffect(() => {
    if (!window.Echo || !otherUserId || !enabled) {
      return;
    }

    const [userId1, userId2] = [currentUserId, otherUserId].sort((a, b) => a - b);
    const channelName = `conversation.${userId1}.${userId2}`;

    try {
      if (channelRef.current) {
        channelRef.current.unsubscribe?.();
        channelRef.current = null;
      }

      const channel = window.Echo.private(channelName);
      channelRef.current = channel;

      try {
        channel.listenForWhisper('typing', handleTypingEvent);
      } catch (error) {
        channel.listen('.typing', (data: any) => {
          if (data && data.userId && data.userId !== currentUserId) {
            handleTypingEvent(data);
          }
        });
      }

      channel.error((error: any) => {
        if (error?.data?.message?.includes('enable this feature in the Settings page')) {
          return;
        }
        
        setTimeout(() => {
          if (isMounted.current && otherUserId) {
            const channelName = `conversation.${Math.min(currentUserId, otherUserId)}.${Math.max(currentUserId, otherUserId)}`;
            window.Echo.leave(channelName);
            channelRef.current = null;
            const newChannel = window.Echo.private(channelName);
            channelRef.current = newChannel;
          }
        }, 3000);
      });

      return () => {
        if (channelRef.current) {
          channelRef.current.unsubscribe?.();
          channelRef.current = null;
        }
      };
    } catch (error) {
      // Silently fail
    }
  }, [currentUserId, otherUserId, enabled, handleTypingEvent]);

  const sendTyping = useCallback((typing: boolean) => {
    if (!window.Echo || !otherUserId || !channelRef.current) {
      return;
    }

    const typingData = { 
      userId: currentUserId,
      timestamp: Date.now()
    };

    try {
      if (channelRef.current.whisper) {
        channelRef.current.whisper('typing', typingData);
      } 
      else if (channelRef.current.listen) {
        channelRef.current.listen('.typing', (data: any) => {
          if (data && data.userId && data.userId !== currentUserId) {
            handleTypingEvent(data);
          }
        });
      }
    } catch (error) {
      // Silently fail
    }
  }, [currentUserId, otherUserId, handleTypingEvent]);

  return { isTyping, sendTyping };
}