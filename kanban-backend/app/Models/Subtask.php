<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subtask extends Model
{
    use HasFactory;

    protected $fillable = ['task_id', 'title', 'is_completed'];
    
    protected $casts = [
        'is_completed' => 'boolean'
    ];
    // Relationship: Subtask belongs to a Task
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
