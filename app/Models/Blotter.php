<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Blotter extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'respondent_name',
        'description',
        'status',
        'scheduled_at',
        'admin_notes',
        'approved_by'
    ];
    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
