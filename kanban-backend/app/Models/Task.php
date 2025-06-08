<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['column_id', 'title', 'description', 'order'];

    // Relationship: Task belongs to a Column
    public function column(): BelongsTo
    {
        return $this->belongsTo(Column::class);
    }

    // Relationship: Task has many Subtasks
    public function subtasks(): HasMany
    {
        return $this->hasMany(Subtask::class);
    }

    // Accessor: Get task status (column name)
    public function getStatusAttribute()
    {
        return $this->column->name;
    }

    // Accessor: Calculate progress percentage
    public function getProgressAttribute()
    {
        $total = $this->subtasks()->count();
        if (!$total) return 0;
        
        $completed = $this->subtasks()->where('is_completed', true)->count();
        return (int) round(($completed / $total) * 100);
    }
}
