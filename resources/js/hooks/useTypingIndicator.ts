import { useEffect, useState, useRef, useCallback } from 'react';

interface TypingIndicatorOptions {
  currentUserId: number;      // Current logged-in user
  otherUserId: number | null; // Chat partner
  enabled?: boolean;          // Enable/disable typing indicator
}

interface PresenceChannel {
  here: (callback: (members: Array<{ id: number; info: { id: number; name: string } }>) => void) => void;
  joining: (callback: (member: { id: number; info: { id: number; name: string } }) => void) => void;
  leaving: (callback: (member: { id: number; info: { id: number; name: string } }) => void) => void;
  error: (callback: (error: Error) => void) => void;
  listenForWhisper?: (event: string, callback: (data: { userId: number }) => void) => void;
  listen?: (event: string, callback: (data: { userId: number }) => void) => void;
  whisper: (event: string, data: Record<string, unknown>) => void;
  // Pusher-style bindings
  bind?: (event: string, callback: (data: unknown) => void) => void;
  on?: (event: string, callback: (data: unknown) => void) => void;
}

export default function useTypingIndicator({
  currentUserId,
  otherUserId,
  enabled = true
}: TypingIndicatorOptions) {
  const [isTyping, setIsTyping] = useState(false);
  const channelRef = useRef<PresenceChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const prevChannelNameRef = useRef<string | null>(null);
  const lastTypingSentAtRef = useRef<number>(0);
  const subscribedRef = useRef<boolean>(false);
  const pendingTypingRef = useRef<boolean>(false);
  const pendingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Store current state in ref to avoid stale closure
  const isTypingRef = useRef(isTyping);
  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  // Typing state drives UI in the chat components

  // Force re-render mechanism removed

  // 🔔 Setup listener for incoming typing events
  useEffect(() => {
    if (!window.Echo || !otherUserId || !enabled) {
      return;
    }

    const [userId1, userId2] = [currentUserId, otherUserId].sort((a, b) => a - b);
    const channelName = `conversation.${userId1}.${userId2}`;

    // Leave any previous channel before joining new one
    if (prevChannelNameRef.current && prevChannelNameRef.current !== channelName) {
      window.Echo.leave(prevChannelNameRef.current);
    }

    // Helper function to set up listeners
    const setupWhisperListeners = (ch: PresenceChannel) => {

      // Try both methods in case one doesn't work
      if (typeof ch.listenForWhisper === 'function') {
        ch.listenForWhisper('typing', (e: { userId: number }) => {
          if (e.userId !== currentUserId) {
            setIsTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
          }
        });

        ch.listenForWhisper('stop-typing', (e: { userId: number }) => {
          if (e.userId !== currentUserId) {
            setIsTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }
        });
      }

      // Also try listen() method as fallback
      if (typeof ch.listen === 'function') {
        ch.listen('.typing', (e: { userId: number }) => {
          if (e.userId !== currentUserId) {
            setIsTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
          }
        });

        ch.listen('.stop-typing', (e: { userId: number }) => {
          if (e.userId !== currentUserId) {
            setIsTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }
        });
      }

      // Extra fallback: some transports expose pusher-style client events via bind/on
      // Bind to 'client-typing' and 'client-stop-typing' as a safety net
      if (typeof ch.bind === 'function') {
        console.log('[TypingIndicator] Binding to client-typing/client-stop-typing via bind()');
        ch.bind('client-typing', (data: unknown) => {
          const e = data as { userId: number };
          if (e.userId !== currentUserId) {
            setIsTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
          }
        });

        ch.bind('client-stop-typing', (data: unknown) => {
          const e = data as { userId: number };
          if (e.userId !== currentUserId) {
            setIsTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }
        });
      }
      // Listeners registered
    };

    try {
      const channel = window.Echo.join(channelName);
      channelRef.current = channel;
      prevChannelNameRef.current = channelName;

      // Wait for channel subscription before setting up listeners
      channel.here((members: Array<{ id: number; info: { id: number; name: string } }>) => {
        subscribedRef.current = true;

        // Set up listeners AFTER channel is confirmed subscribed
        setupWhisperListeners(channel);

        // Test if the channel supports whispers
        if (channel.whisper) {
        } else {
        }

        // If a typing whisper was attempted before subscription, send one now
        if (pendingTypingRef.current && channelRef.current) {
          try {
            channelRef.current.whisper('typing', { userId: currentUserId });
            lastTypingSentAtRef.current = Date.now();
          } catch (err) {
            // ignore
          } finally {
            pendingTypingRef.current = false;
          }
        }
      });

      channel.joining((_member: { id: number; info: { id: number; name: string } }) => {});

      channel.leaving((_member: { id: number; info: { id: number; name: string } }) => {});

      channel.error((_error: Error) => {});

      // Set up listeners IMMEDIATELY (not waiting for .here())
      if (typeof channel.listenForWhisper === 'function') {

        // Set up listening for incoming whispers
        channel.listenForWhisper('typing', (e: { userId: number }) => {
          if (e.userId !== currentUserId) {
            setIsTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 3000);
          } else {
            // ignore self whisper
          }
        });

        channel.listenForWhisper('stop-typing', (e: { userId: number }) => {
          if (e.userId !== currentUserId) {
            setIsTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }
        });

      } else {
        // Fallbacks omitted
      }
    } catch (error) {
      // ignore
    }

    // 🧹 Cleanup when component unmounts or user changes
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      window.Echo.leave(channelName);
      channelRef.current = null;
      prevChannelNameRef.current = null;
      subscribedRef.current = false;
      pendingTypingRef.current = false;
    };
  }, [currentUserId, otherUserId, enabled]);

  // ✍️ Send typing indicator (debounced to avoid spam)
  const sendTyping = useCallback(() => {
    if (!channelRef.current || !otherUserId || !enabled) {
      return;
    }

    const channel = channelRef.current;

    // Leading-edge: if we haven't sent in the last 800ms, send immediately
    const now = Date.now();
    if (!subscribedRef.current) {
      pendingTypingRef.current = true;
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = setTimeout(() => {
        if (subscribedRef.current && channelRef.current) {
          try {
            channelRef.current.whisper('typing', { userId: currentUserId });
            lastTypingSentAtRef.current = Date.now();
          } catch (_err) {
            // ignore
          }
        }
      }, 200);
    } else if (now - lastTypingSentAtRef.current > 800) {
      try {
        channel.whisper('typing', { userId: currentUserId });
        lastTypingSentAtRef.current = now;
      } catch (_error) {
        // ignore
      }
    }

    // Debounce subsequent typing signals every 300ms (trailing)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        channel.whisper('typing', { userId: currentUserId });
        lastTypingSentAtRef.current = Date.now();
      } catch (_error) {
        // ignore
      }

      // Auto stop after 3s of inactivity
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        channel.whisper('stop-typing', { userId: currentUserId });
      }, 3000);
    }, 300);
  }, [currentUserId, otherUserId, enabled]);

  // 🛑 Manually stop typing
  const stopTyping = useCallback(() => {
    if (!channelRef.current || !otherUserId || !enabled) return;

    const channel = channelRef.current;
    channel.whisper('stop-typing', { userId: currentUserId });

    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, [currentUserId, otherUserId, enabled]);

  return {
    isTyping,
    sendTyping,
    stopTyping,
  };
}
