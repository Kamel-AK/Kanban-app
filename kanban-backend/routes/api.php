<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SubtaskController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Boards
Route::apiResource('boards', BoardController::class);

// Columns (nested under boards)
Route::prefix('boards/{board}')->group(function () {
    Route::post('columns', [ColumnController::class, 'store']);
    Route::put('columns/{column}', [ColumnController::class, 'update']);
    Route::delete('columns/{column}', [ColumnController::class, 'destroy']);
});

// Tasks (nested under columns)
Route::prefix('columns/{column}')->group(function () {
    Route::apiResource('tasks', TaskController::class)->except(['update']);
    Route::put('tasks/{task}', [TaskController::class, 'update']); // Special update
});

// Subtasks (nested under tasks)
Route::prefix('tasks/{task}')->group(function () {
    Route::post('subtasks', [SubtaskController::class, 'store']);
    Route::put('subtasks/{subtask}', [SubtaskController::class, 'update']);
    Route::delete('subtasks/{subtask}', [SubtaskController::class, 'destroy']);
});
