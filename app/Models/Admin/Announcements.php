<?php
namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Model;

class Announcements extends Model
{
    protected $fillable = [
        'title',
        'message',
        'type',
        'meeting_date',
    ];
}
