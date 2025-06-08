<?php

namespace App\Http\Controllers;

use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Http\Request;
/**
 * @OA\SecurityRequirement(name="bearerAuth")
 */
/**
 * @OA\Tag(
 *     name="Subtasks",
 *     description="Operations about subtasks"
 * )
 */
class SubtaskController extends Controller
{
        /**
     * @OA\Post(
     *     path="/api/tasks/{task}/subtasks",
     *     summary="Create a new subtask",
     *     tags={"Subtasks"},
     *     @OA\Parameter(
     *         name="task",
     *         in="path",
     *         required=true,
     *         description="Task ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Subtask data",
     *         @OA\JsonContent(
     *             required={"title"},
     *             @OA\Property(property="title", type="string", example="New Subtask")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Subtask created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="is_completed", type="boolean")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(Request $request, Task $task)
    {
        $request->validate(['title' => 'required|string|max:255']);
        
        $subtask = $task->subtasks()->create([
            'title' => $request->title,
            'is_completed' => false
        ]);
        
        return response()->json($subtask, 201);
    }

    /**
     * @OA\Put(
     *     path="/api/subtasks/{id}",
     *     summary="Update a subtask",
     *     tags={"Subtasks"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Subtask ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Subtask data to update",
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Updated Subtask"),
     *             @OA\Property(property="is_completed", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Subtask updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="is_completed", type="boolean")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Subtask not found"
     *     )
     * )
     */
    public function update(Request $request, Subtask $subtask)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'is_completed' => 'sometimes|boolean'
        ]);
        
        $subtask->update($request->only(['title', 'is_completed']));
        return response()->json($subtask);
    }

 /**
     * @OA\Delete(
     *     path="/api/subtasks/{id}",
     *     summary="Delete a subtask",
     *     tags={"Subtasks"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Subtask ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Subtask deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Subtask deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Subtask not found"
     *     )
     * )
     */
    public function destroy(Subtask $subtask)
    {
        $subtask->delete();
        return response()->json(['message' => 'Subtask deleted successfully']);
    }
}
