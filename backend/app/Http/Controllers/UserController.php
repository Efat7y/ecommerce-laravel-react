<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function adminUsers(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::where('role', '!=', 'admin')->with(['orders', 'payments']);
        
        if ($request->query('role')) {
            $query->where('role', $request->query('role'));
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'users' => $users
        ]);
    }

    public function updateTier(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'tier' => 'required|in:standard,vip,wholesale'
        ]);

        $user = User::findOrFail($id);
        $user->tier = $request->tier;
        $user->save();

        return response()->json([
            'message' => 'تم تحديث تصنيف العميل بنجاح',
            'user' => $user
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:unverified,active,banned'
        ]);

        $user = User::findOrFail($id);
        $user->status = $request->status;
        
        // If banning, you might want to revoke tokens so they are kicked out immediately
        if ($request->status === 'banned') {
            $user->tokens()->delete();
        }

        $user->save();

        return response()->json([
            'message' => 'تم تحديث حالة العميل بنجاح',
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string',
            'tier' => 'required|in:standard,vip,wholesale',
            'status' => 'required|in:unverified,active,banned',
            'role' => 'nullable|in:user,vendor'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'phone' => $request->phone,
            'tier' => $request->tier,
            'status' => $request->status,
            'role' => $request->role ?? 'user'
        ]);

        return response()->json([
            'message' => 'تم إنشاء المستخدم بنجاح',
            'user' => $user
        ]);
    }
}
