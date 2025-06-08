<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Column extends Model
{
    use HasFactory;

    protected $fillable = ['board_id', 'name', 'order'];

    // Relationship: Column belongs to a Board
    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    // Relationship: Column has many Tasks
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class)->orderBy('order');
    }
}
