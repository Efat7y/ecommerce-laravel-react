<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Register
    public function register(RegisterRequest $request)
    {
        $request->validated();

        $otpCode = rand(100000, 999999);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'status' => 'active', // Temporarily bypass OTP
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Registration successful. Please verify your account.',
            'dev_otp' => $otpCode // NOTE: Only for development, remove in production!
        ]);
    }

    // Login
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string'
        ]);

        $identifier = $request->identifier;
        $loginField = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';

        if (!Auth::attempt([$loginField => $identifier, 'password' => $request->password])) {
            return response()->json(['message' => 'بيانات الدخول غير صحيحة'], 401);
        }

        $user = Auth::user();

        if ($user->status === 'banned') {
            Auth::logout();
            return response()->json(['message' => 'تم حظر حسابك من قبل الإدارة'], 403);
        }

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    // Verify OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|string',
        ]);

        $user = auth('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if ($user->status !== 'unverified') {
            return response()->json(['message' => 'حسابك مفعل بالفعل'], 400);
        }

        if ($user->otp_code !== $request->otp) {
            return response()->json(['message' => 'كود التحقق غير صحيح'], 400);
        }

        if (now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['message' => 'انتهت صلاحية كود التحقق'], 400);
        }

        $user->update([
            'status' => 'active',
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        return response()->json([
            'message' => 'تم تفعيل الحساب بنجاح',
            'user' => $user
        ]);
    }
}
