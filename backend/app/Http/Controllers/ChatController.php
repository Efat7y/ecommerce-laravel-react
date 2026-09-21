<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    // Start or get existing conversation
    public function startConversation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $currentUserId = Auth::id();
        $otherUserId = $request->user_id;

        if ($currentUserId == $otherUserId) {
            return response()->json(['message' => 'Cannot chat with yourself.'], 400);
        }

        $user1 = min($currentUserId, $otherUserId);
        $user2 = max($currentUserId, $otherUserId);

        $conversation = Conversation::firstOrCreate(
            ['user1_id' => $user1, 'user2_id' => $user2]
        );

        return response()->json($conversation);
    }

    // Get list of conversations for inbox
    public function getConversations()
    {
        $userId = Auth::id();

        $conversations = Conversation::where('user1_id', $userId)
            ->orWhere('user2_id', $userId)
            ->with(['user1:id,name,avatar', 'user2:id,name,avatar'])
            ->withCount(['messages as unread_count' => function ($query) use ($userId) {
                $query->where('is_read', false)->where('sender_id', '!=', $userId);
            }])
            ->get()
            ->map(function ($conv) use ($userId) {
                $latestMessage = $conv->messages()->latest()->first();
                $conv->latest_message = $latestMessage;
                $conv->other_user = $conv->user1_id == $userId ? $conv->user2 : $conv->user1;
                unset($conv->user1);
                unset($conv->user2);
                return $conv;
            })
            ->sortByDesc(function ($conv) {
                return $conv->latest_message ? $conv->latest_message->created_at : $conv->created_at;
            })
            ->values();

        return response()->json($conversations);
    }

    // Get messages for a specific conversation
    public function getMessages($conversationId)
    {
        $userId = Auth::id();
        $conversation = Conversation::findOrFail($conversationId);

        if ($conversation->user1_id != $userId && $conversation->user2_id != $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = $conversation->messages()->latest()->take(50)->get()->reverse()->values();
        $otherUserId = $conversation->user1_id == $userId ? $conversation->user2_id : $conversation->user1_id;
        $isTyping = \Illuminate\Support\Facades\Cache::has('chat_typing_' . $conversation->id . '_' . $otherUserId);

        return response()->json([
            'messages' => $messages,
            'is_typing' => $isTyping
        ]);
    }

    // Send a message
    public function sendMessage(Request $request, $conversationId)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $userId = Auth::id();
        $conversation = Conversation::findOrFail($conversationId);

        if ($conversation->user1_id != $userId && $conversation->user2_id != $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = ChatMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $userId,
            'message' => $request->message,
            'is_read' => false
        ]);

        return response()->json($message);
    }

    // Mark messages as read
    public function markAsRead($conversationId)
    {
        $userId = Auth::id();
        
        ChatMessage::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }

    // Broadcast typing status
    public function typing($conversationId)
    {
        $userId = Auth::id();
        \Illuminate\Support\Facades\Cache::put('chat_typing_' . $conversationId . '_' . $userId, true, 3);
        return response()->json(['success' => true]);
    }
}