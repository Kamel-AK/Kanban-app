<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Models\Task;
use Illuminate\Http\Request;
/**
 * @OA\SecurityRequirement(name="bearerAuth")
 */
/**
 * @OA\Tag(
 *     name="Tasks",
 *     description="Operations about tasks"
 * )
 */
class TaskController extends Controller
{
   /**
     * @OA\Post(
     *     path="/api/columns/{column}/tasks",
     *     summary="Create a new task in a column",
     *     tags={"Tasks"},
     *     @OA\Parameter(
     *         name="column",
     *         in="path",
     *         required=true,
     *         description="Column ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Task data",
     *         @OA\JsonContent(
     *             required={"title"},
     *             @OA\Property(property="title", type="string", example="New Task"),
     *             @OA\Property(property="description", type="string", example="Task description")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Task created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="order", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(Request $request, Column $column)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);
        
        $position = $column->tasks()->count();
        $task = $column->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'order' => $position
        ]);
        
        return response()->json($task, 201);
    }

    /**
     * @OA\Put(
     *     path="/api/tasks/{id}",
     *     summary="Update a task",
     *     tags={"Tasks"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Task ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Task data to update",
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Updated Task"),
     *             @OA\Property(property="description", type="string", example="Updated description"),
     *             @OA\Property(property="column_id", type="integer", example=2),
     *             @OA\Property(property="order", type="integer", example=0)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Task updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="column_id", type="integer"),
     *             @OA\Property(property="order", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Task not found"
     *     )
     * )
     */
    
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'column_id' => 'sometimes|exists:columns,id',
            'order' => 'sometimes|integer'
        ]);
        
        // Handle column change
        if ($request->has('column_id') && $request->column_id != $task->column_id) {
            $oldColumn = $task->column;
            $newColumn = Column::find($request->column_id);
            
            // Remove from old column
            $oldColumn->tasks()
                ->where('order', '>', $task->order)
                ->decrement('order');
            
            // Prepare new position
            $newPosition = $request->order ?? $newColumn->tasks()->count();
            
            // Make space in new column
            $newColumn->tasks()
                ->where('order', '>=', $newPosition)
                ->increment('order');
            
            $task->column_id = $newColumn->id;
            $task->order = $newPosition;
        }
        // Handle position change in same column
        elseif ($request->has('order')) {
            $oldPosition = $task->order;
            $newPosition = $request->order;
            
            if ($newPosition > $oldPosition) {
                $task->column->tasks()
                    ->where('order', '>', $oldPosition)
                    ->where('order', '<=', $newPosition)
                    ->decrement('order');
            } else {
                $task->column->tasks()
                    ->where('order', '>=', $newPosition)
                    ->where('order', '<', $oldPosition)
                    ->increment('order');
            }
            
            $task->order = $newPosition;
        }
        
        // Update other fields
        if ($request->has('title')) {
            $task->title = $request->title;
        }
        
        if ($request->has('description')) {
            $task->description = $request->description;
        }
        
        $task->save();
        return response()->json($task->load('subtasks'));
    }

        /**
     * @OA\Delete(
     *     path="/api/tasks/{id}",
     *     summary="Delete a task",
     *     tags={"Tasks"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Task ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Task deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Task deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Task not found"
     *     )
     * )
     */
    public function destroy(Task $task)
    {
        $task->delete();
        
        // Reorder remaining tasks
        $task->column->tasks()
            ->orderBy('order')
            ->get()
            ->each(fn($t, $index) => $t->update(['order' => $index]));
            
        return Response::json(['message' => 'Task deleted successfully']);
    }
}
