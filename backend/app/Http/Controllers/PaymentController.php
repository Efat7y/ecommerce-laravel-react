<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Get the ledger for a specific user.
     */
    public function getUserLedger(Request $request, $userId)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::with(['orders' => function($q) {
            $q->orderBy('created_at', 'desc');
        }, 'payments' => function($q) {
            $q->orderBy('created_at', 'desc');
        }])->findOrFail($userId);

        // Calculate totals
        $totalOrders = $user->orders->sum('total');
        $totalCreditOrders = $user->orders->where('payment_method', 'credit')->sum('total');
        $totalPayments = $user->payments->sum('amount');
        
        // Outstanding balance is based on credit orders minus recorded payments
        $outstandingBalance = $totalCreditOrders - $totalPayments;

        return response()->json([
            'user' => $user,
            'ledger' => [
                'total_orders_amount' => $totalOrders,
                'total_credit_orders' => $totalCreditOrders,
                'total_payments' => $totalPayments,
                'outstanding_balance' => $outstandingBalance,
            ]
        ]);
    }

    /**
     * Record a new payment from a user.
     */
    public function storePayment(Request $request, $userId)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        $user = User::findOrFail($userId);

        $payment = Payment::create([
            'user_id' => $user->id,
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'],
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'payment' => $payment
        ], 201);
    }
}
