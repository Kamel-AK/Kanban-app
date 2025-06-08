<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // Relationship: Board has many Columns
    public function columns(): HasMany
    {
        return $this->hasMany(Column::class)->orderBy('order');
    }

    // Relationship: Board has many Tasks through Columns
    public function tasks()
    {
        return $this->hasManyThrough(Task::class, Column::class);
    }
}
