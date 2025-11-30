<?php

namespace App\Events;

use App\Models\Blotter;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BlotterStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Blotter $blotter)
    {
        $this->blotter->load(['user', 'approvedBy']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */

     public function broadcastOn(): Channel
    {
        // Broadcast to the specific user's private channel
        return new Channel('user.' . $this->blotter->user_id);
    }
    public function broadcastAs(): string
    {
        return 'blotter.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'blotter' => [
                'id' => $this->blotter->id,
                'type' => $this->blotter->type,
                'status' => $this->blotter->status,
                'scheduled_at' => $this->blotter->scheduled_at?->format('Y-m-d H:i:s'),
                'admin_notes' => $this->blotter->admin_notes,
                'approved_by' => $this->blotter->approvedBy?->name,
            ],
            'message' => $this->getNotificationMessage(),
        ];
    }
    private function getNotificationMessage(): string
    {
        return match($this->blotter->status) {
            'approved' => "Your blotter request has been approved and scheduled for {$this->blotter->scheduled_at->format('M d, Y h:i A')}",
            'rejected' => "Your blotter request has been rejected",
            default => "Your blotter request status has been updated",
        };
    }
}
