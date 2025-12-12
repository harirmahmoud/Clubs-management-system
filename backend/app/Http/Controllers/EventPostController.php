<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventPost;
use App\Models\Event;
class EventPostController extends Controller
{
    public function index($eventId)
    {
        $event = Event::find($eventId);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }
        $posts = EventPost::where('event_id', $eventId)->paginate(10);
        return response()->json(['data' => $posts], 200);
    }
    public function store(Request $request,$eventId)
    {
        $event = Event::find($eventId);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }
        $validatedData = $request->validate([
            'content' => 'nullable|string',
            'post_image' => 'nullable|string|max:255',
            'post_image2' => 'nullable|string|max:255',
            'post_image3' => 'nullable|string|max:255',
            'post_image4' => 'nullable|string|max:255',
            'post_video' => 'nullable|string|max:255',
            'created_by' => 'required|integer|exists:users,id'
        ]);
        $data_to_create = $request->all();
        $data_to_create['event_id'] = $eventId;
        $post = EventPost::create($data_to_create);
        return response()->json(['data' => $post], 201);
    }

}
