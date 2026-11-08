<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'title',
        'content',
        'pinned',
    ];

    protected function casts(): array
    {
        return [
            'pinned' => 'boolean',
        ];
    }
}
