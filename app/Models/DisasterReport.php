<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisasterReport extends Model
{
    protected $fillable = [
        'user_id', // This is the reporter's ID
        'disaster_type',
        'description',
        'location',
        'occurred_at',
        'status',
        'resolved_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
        'resolved_at' => 'datetime',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',

    ];

    // Use this for the reporter (the user who submitted the report)
    public function reporter()
    {
        return $this->belongsTo(User::class, 'user_id'); // Now uses existing 'user_id' column
    }

    // Keep this if you need it for something else (e.g., an assigned user), otherwise remove
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
