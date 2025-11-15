<?php
namespace App\Models\Admin;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'age',
        'suffix',
        'gender',
        'zone',
        'household_no',
        'contact_no',
        'email',
    ];
    protected $casts = [
        'age' => 'integer',
    ];
    // Accessor to get full name
    public function getFullNameAttribute()
    {
        $name = $this->first_name . ' ' . $this->last_name;
        if ($this->suffix) {
            $name .= ' ' . $this->suffix;
        }
        return $name;

    }
}
