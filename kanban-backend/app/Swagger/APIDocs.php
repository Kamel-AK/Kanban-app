<?php

namespace App\Swagger;

/**
 * @OA\Info(
 *     title="Kanban Board API",
 *     version="1.0.0",
 *     description="API for managing kanban boards, columns, tasks, and subtasks",
 *     @OA\Contact(email="support@example.com"),
 *     @OA\License(
 *         name="Apache 2.0",
 *         url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Local API Server"
 * )
 * 
 * @OA\Components(
 *     @OA\SecurityScheme(
 *         securityScheme="bearerAuth",
 *         type="http",
 *         scheme="bearer"
 *     ),
  *     @OA\Schema(
 *         schema="Board",
 *         type="object",
 *         @OA\Property(property="id", type="integer"),
 *         @OA\Property(property="name", type="string"),
 *         @OA\Property(
 *             property="columns",
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Column")
 *         )
 *     ),
 *     @OA\Schema(
 *         schema="Column",
 *         type="object",
 *         @OA\Property(property="id", type="integer"),
 *         @OA\Property(property="name", type="string"),
 *         @OA\Property(property="order", type="integer"),
 *         @OA\Property(
 *             property="tasks",
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Task")
 *         )
 *     ),
 *     @OA\Schema(
 *         schema="Task",
 *         type="object",
 *         @OA\Property(property="id", type="integer"),
 *         @OA\Property(property="title", type="string"),
 *         @OA\Property(property="description", type="string"),
 *         @OA\Property(property="order", type="integer"),
 *         @OA\Property(
 *             property="subtasks",
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Subtask")
 *         )
 *     ),
 *     @OA\Schema(
 *         schema="Subtask",
 *         type="object",
 *         @OA\Property(property="id", type="integer"),
 *         @OA\Property(property="title", type="string"),
 *         @OA\Property(property="is_completed", type="boolean")
 *     )
 */
class APIDocs {}