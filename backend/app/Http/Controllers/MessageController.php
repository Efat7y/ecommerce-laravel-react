<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Message;

class MessageController extends Controller
{
    // For customers to submit contact form
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'subject' => 'nullable|string',
            'message' => 'required|string'
        ]);

        Message::create($request->all());

        return response()->json(['message' => 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.']);
    }

    // For admins to list messages
    public function index()
    {
        $messages = Message::latest()->get();
        return response()->json($messages);
    }

    // For admins to mark as read
    public function markAsRead($id)
    {
        $message = Message::findOrFail($id);
        $message->update(['is_read' => true]);
        return response()->json(['message' => 'تم تعيين الرسالة كمقروءة']);
    }
}
