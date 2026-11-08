<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Task::with('project')->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => ['nullable', 'exists:projects,id'],
            'title' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'status' => ['sometimes', 'in:To Do,In Progress,Review,Completed'],
            'priority' => ['sometimes', 'in:Low,Medium,High,Urgent'],
            'due_date' => ['nullable', 'date'],
        ]);

        $task = Task::create($validated);

        return response()->json($task->load('project'), 201);
    }

    public function show(Task $task): JsonResponse
    {
        return response()->json($task->load('project'));
    }

    public function update(Request $request, Task $task): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => ['sometimes', 'nullable', 'exists:projects,id'],
            'title' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'nullable', 'string', 'max:500'],
            'status' => ['sometimes', 'in:To Do,In Progress,Review,Completed'],
            'priority' => ['sometimes', 'in:Low,Medium,High,Urgent'],
            'due_date' => ['sometimes', 'nullable', 'date'],
        ]);

        $task->update($validated);

        return response()->json($task->fresh()->load('project'));
    }

    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully.',
        ]);
    }
}
