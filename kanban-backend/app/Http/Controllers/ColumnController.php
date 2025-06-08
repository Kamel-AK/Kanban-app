<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Column;
use Illuminate\Http\Request;
/**
 * @OA\SecurityRequirement(name="bearerAuth")
 */
/**
 * @OA\Tag(
 *     name="Columns",
 *     description="Operations about columns"
 * )
 */
class ColumnController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/boards/{board}/columns",
     *     summary="Create a new column in a board",
     *     tags={"Columns"},
     *     @OA\Parameter(
     *         name="board",
     *         in="path",
     *         required=true,
     *         description="Board ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Column data",
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="Backlog")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Column created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="order", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(Request $request, Board $board)
    {
        $request->validate(['name' => 'required|string|max:255']);
        
        $position = $board->columns()->count();
        $column = $board->columns()->create([
            'name' => $request->name,
            'order' => $position
        ]);
        
        return response()->json($column, 201);
    }

    /**
     * @OA\Put(
     *     path="/api/boards/{board}/columns/{column}",
     *     summary="Update a column",
     *     tags={"Columns"},
     *     @OA\Parameter(
     *         name="board",
     *         in="path",
     *         required=true,
     *         description="Board ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="column",
     *         in="path",
     *         required=true,
     *         description="Column ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Column data to update",
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Updated Column Name"),
     *             @OA\Property(property="order", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Column updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="order", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Column not found"
     *     )
     * )
     */
    public function update(Request $request, Column $column)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'order' => 'sometimes|integer'
        ]);
        
        if ($request->has('order')) {
            $oldPosition = $column->order;
            $newPosition = $request->order;
            
            if ($newPosition < $oldPosition) {
                $column->board->columns()
                    ->where('order', '>=', $newPosition)
                    ->where('order', '<', $oldPosition)
                    ->increment('order');
            } else {
                $column->board->columns()
                    ->where('order', '>', $oldPosition)
                    ->where('order', '<=', $newPosition)
                    ->decrement('order');
            }
            
            $column->order = $newPosition;
        }
        
        if ($request->has('name')) {
            $column->name = $request->name;
        }
        
        $column->save();
        return response()->json($column);
    }

    /**
     * @OA\Delete(
     *     path="/api/boards/{board}/columns/{column}",
     *     summary="Delete a column",
     *     tags={"Columns"},
     *     @OA\Parameter(
     *         name="board",
     *         in="path",
     *         required=true,
     *         description="Board ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="column",
     *         in="path",
     *         required=true,
     *         description="Column ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Column deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Column deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Column not found"
     *     )
     * )
     */
    public function destroy(Column $column)
    {
        $column->delete();
        
        // Reorder remaining columns
        $column->board->columns()
            ->orderBy('order')
            ->get()
            ->each(fn($col, $index) => $col->update(['order' => $index]));
            
        return response()->json(['message' => 'Column deleted successfully']);
    }
}
