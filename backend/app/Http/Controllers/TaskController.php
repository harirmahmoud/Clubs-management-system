<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use App\Facades\Neo4j;
class TaskController extends Controller
{
    protected $neo4j;
    public function __construct()
    {
        // Inject Neo4j Aura client (configured via a ServiceProvider)
        $this->neo4j = app('neo4j');
    }
    public function index($projectId)
    {
        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        $projectTasks = Task::where('project_id', $projectId)->get();
        return response()->json(['data' => $projectTasks], 200);
    }

    public function store(Request $request,$projectId)
    {
        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            "start_date" => 'nullable|date',
            "end_date" => 'nullable|date',
            'status' => 'required|string|in:pending,in_progress,completed',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'created_by' => 'required|integer|exists:users,id',
        ]);

        $task = Task::create($request->all());

        // Save in Neo4j
        $this->neo4j->run(
            'MATCH (p:Project {id: $projectId}), (u:User {id: $userId})
             CREATE (t:Task $data)<-[:CREATED]-(u)-[:HAS_TASK]->(p)
             RETURN t',
            [
                'projectId' => $projectId,
                'userId' => Auth::id(),
                'data' => $validatedData
            ]
        );

        return response()->json(['data' => $task], 201);
    }

    public function show($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        return response()->json(['data' => $task], 200);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255|nullable',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            "start_date" => 'nullable|date',
            "end_date" => 'nullable|date',
            'status' => 'required|string|in:pending,in_progress,completed|nullable',
            'assigned_to' => 'nullable|integer|exists:users,id',
            'created_by' => 'required|integer|exists:users,id',
        ]);
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        $task->update($validatedData);

        // Update Neo4j
        $this->neo4j->run(
            'MATCH (t:Task {id: $id})
             SET t += $data
             RETURN t',
            ['id' => $task->id, 'data' => $validatedData]
        );

        return response()->json(['data' => $task], 200);
    }

    public function destroy($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        $task->delete();

        // Delete from Neo4j
        $this->neo4j->run(
            'MATCH (t:Task {id: $id}) DETACH DELETE t',
            ['id' => $id]
        );

        return response()->json(['message' => 'Task deleted successfully'], 200);
    }
    public function updateStatus(Request $request, $id)
    {
        $validatedData = $request->validate([
            'status' => 'required|string|in:pending,in_progress,completed',
        ]);
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        $task->status = $request->input('status');
        $task->save();

        $this->neo4j->run(
            'MATCH (t:Task {id: $id})
             SET t.status = $status
             RETURN t',
            ['id' => $id, 'status' => $validatedData['status']]
        );

        return response()->json(['data' => $task], 200);
    }
    public function assign(Request $request, $id)
    {
        $validatedData = $request->validate([
            'assigned_to' => 'required|integer|exists:users,id',
        ]);
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        $task->assigned_to = $request->input('assigned_to');
        $task->save();

        $this->neo4j->run(
            'MATCH (t:Task {id: $id}), (u:User {id: $userId})
             MERGE (u)-[:ASSIGNED]->(t)
             RETURN t, u',
            ['id' => $id, 'userId' => $validatedData['assigned_to']]
        );


        return response()->json(['data' => $task], 200);
    }
}
