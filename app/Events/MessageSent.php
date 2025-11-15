<?php
namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->message->recipient_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'id'           => $this->message->id,
            'sender_id'    => $this->message->sender_id,
            'recipient_id' => $this->message->recipient_id,
            'body'         => $this->message->body,
            'is_read'      => $this->message->is_read,
            'sender_type'  => $this->message->sender_type,
            'created_at'   => $this->message->created_at,
            'sender'       => [
                'id'    => $this->message->sender->id,
                'name'  => $this->message->sender->name,
                'email' => $this->message->sender->email,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

}
