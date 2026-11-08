<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    private function addTaskStats(Project $project): Project
    {
        $project->loadCount('tasks');

        $project->loadCount([
            'tasks as completed_tasks_count' => function ($query) {
                $query->where('status', 'Completed');
            },
        ]);

        $total = $project->tasks_count;
        $completed = $project->completed_tasks_count;

        $project->setAttribute(
            'progress',
            $total > 0
                ? (int) round(($completed / $total) * 100)
                : 0
        );

        return $project;
    }

    public function index(): JsonResponse
    {
        $projects = Project::latest()->get();

        $projects->each(function ($project) {
            $this->addTaskStats($project);
        });

        return response()->json($projects);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'description' => ['nullable', 'string', 'max:300'],
            'status' => ['sometimes', 'in:In Progress,Completed,On Hold'],
            'progress' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'due_date' => ['nullable', 'date'],
        ]);

        $project = Project::create($validated);

        return response()->json(
            $this->addTaskStats($project),
            201
        );
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json(
            $this->addTaskStats($project)
        );
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:80'],
            'description' => ['sometimes', 'nullable', 'string', 'max:300'],
            'status' => ['sometimes', 'in:In Progress,Completed,On Hold'],
            'progress' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'due_date' => ['sometimes', 'nullable', 'date'],
        ]);

        $project->update($validated);

        return response()->json(
            $this->addTaskStats($project->fresh())
        );
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully.',
        ]);
    }
}
