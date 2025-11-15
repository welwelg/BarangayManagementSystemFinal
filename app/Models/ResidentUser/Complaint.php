<?php
namespace App\Models\ResidentUser;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    protected $fillable = ['user_id', 'title', 'description', 'status', 'handler_id', 'resolved_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function handler()
    {
        return $this->belongsTo(User::class, 'handler_id');
    }

    public function setStatusAttribute($value)
    {
        $this->attributes['status'] = $value;

        if ($value === 'resolved' && ! $this->resolved_at) {
            $this->attributes['resolved_at'] = now();
        }
    }
}
