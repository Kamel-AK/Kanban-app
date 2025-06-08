<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;
/**
 * @OA\SecurityRequirement(name="bearerAuth")
 */
/**
 * @OA\Tag(
 *     name="Boards",
 *     description="Operations about boards"
 * )
 */
class BoardController extends Controller
{
/**
 * @OA\Get(
 *     path="/api/boards",
 *     summary="Get all boards",
 *     tags={"Boards"},
 *     @OA\Response(
 *         response=200,
 *         description="Successful operation",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Board")
 *         )
 *     )
 * )
 */
    public function index()
    {
        return Board::with(['columns.tasks.subtasks'])->get(); //
    }

/**
    * @OA\Post(
    *     path="/api/boards",
    *     summary="Create a new board",
    *     tags={"Boards"},
    *     @OA\RequestBody(
    *         required=true,
    *         description="Board data",
    *         @OA\JsonContent(
    *             required={"name"},
    *             @OA\Property(property="name", type="string", example="New Project")
    *             )
    *         )
    *     ),
    *     @OA\Response(
    *         response=201,
    *         description="Board created successfully",
    *         @OA\JsonContent(
    *             @OA\Property(property="id", type="integer"),
    *             @OA\Property(property="name", type="string")
    *         )
    *     ),
    *     @OA\Response(
    *         response=422,
    *         description="Validation error"
    *     )
    * )
    */
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']); //
        
        $board = Board::create($request->only('name')); //
        
        // Add default columns
        $defaultColumns = ['Todo', 'Doing', 'Done']; //
        foreach ($defaultColumns as $index => $name) { //
            $board->columns()->create([ //
                'name' => $name, //
                'order' => $index //
            ]);
        }
        return response()->json($board->load('columns'), 201); //
    }

       /**
     * @OA\Get(
     *     path="/api/boards/{id}",
     *     summary="Get board by ID",
     *     tags={"Boards"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Board ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(
     *                 property="columns",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="order", type="integer"),
     *                     @OA\Property(
     *                         property="tasks",
     *                         type="array",
     *                         @OA\Items(
     *                             @OA\Property(property="id", type="integer"),
     *                             @OA\Property(property="title", type="string"),
     *                             @OA\Property(property="description", type="string"),
     *                             @OA\Property(
     *                                 property="subtasks",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     @OA\Property(property="id", type="integer"),
     *                                     @OA\Property(property="title", type="string"),
     *                                     @OA\Property(property="is_completed", type="boolean")
     *                                 )
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Board not found"
     *     )
     * )
     */
    public function show(string $id)
    {
        return Board::with([ //
            'columns' => fn($q) => $q->orderBy('order'), //
            'columns.tasks' => fn($q) => $q->orderBy('order'), //
            'columns.tasks.subtasks' //
        ])->findOrFail($id); //
    }

        /**
     * @OA\Put(
     *     path="/api/boards/{id}",
     *     summary="Update board name",
     *     tags={"Boards"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Board ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="New board name",
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="Updated Board Name")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Board updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Board")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Board not found"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $board = Board::findOrFail($id); //
        $request->validate(['name' => 'required|string|max:255']); //
        $board->update($request->only('name')); //
        return response()->json($board); //
    }

    /**
     * @OA\Delete(
     *     path="/api/boards/{id}",
     *     summary="Delete a board",
     *     tags={"Boards"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Board ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Board deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Board deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Board not found"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $board = Board::findOrFail($id); //
        $board->delete(); //
        return response()->json(['message' => 'Board deleted successfully']); //
    }
}