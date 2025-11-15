<?php
namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * Get the complaints for the user.
     */
    public function complaints()
    {
        return $this->hasMany(\App\Models\ResidentUser\Complaint::class);
    }

    /**
     * Get the complaints handled by this user.
     */
    public function handledComplaints()
    {
        return $this->hasMany(\App\Models\ResidentUser\Complaint::class, 'handler_id');
    }

    /**
     * Get the disaster reports for this user.
     */
    public function disasterReports()
    {
        return $this->hasMany(DisasterReport::class, 'user_id');
    }

    /**
     * Get all messages sent by this user.
     */
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Get all messages received by this user.
     */
    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }

    /**
     * Get unread messages count for this user.
     *
     * @return int
     */
    public function unreadMessagesCount()
    {
        return $this->receivedMessages()
            ->where('is_read', false)
            ->count();
    }

    /**
     * Get all messages (sent and received) for this user.
     */
    public function allMessages()
    {
        return Message::where('sender_id', $this->id)
            ->orWhere('recipient_id', $this->id)
            ->orderBy('created_at', 'desc');
    }
}
