<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Note::latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:100'],
            'content' => ['required', 'string', 'max:5000'],
            'pinned' => ['sometimes', 'boolean'],
        ]);

        $note = Note::create($validated);

        return response()->json($note, 201);
    }

    public function show(Note $note): JsonResponse
    {
        return response()->json($note);
    }

    public function update(Request $request, Note $note): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'nullable', 'string', 'max:100'],
            'content' => ['sometimes', 'required', 'string', 'max:5000'],
            'pinned' => ['sometimes', 'boolean'],
        ]);

        $note->update($validated);

        return response()->json($note->fresh());
    }

    public function destroy(Note $note): JsonResponse
    {
        $note->delete();

        return response()->json([
            'message' => 'Note deleted successfully.',
        ]);
    }
}
