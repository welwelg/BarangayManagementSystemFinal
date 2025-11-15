<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
                                               // 🔹 Try different possible paths based on your project structure
        return Inertia::render('auth/login', [ // lowercase - try this first
            'canResetPassword' => Route::has('password.request'),
            'status'           => $request->session()->get('status'),
        ]);

        // 🔸 If above doesn't work, try:
        // return Inertia::render('Auth/Login', [
        // or
        // return Inertia::render('login', [
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();

        // 🔹 Role-based redirect
        if ($user->hasRole('superadmin')) {
            return redirect()->intended('/admin/dashboard');
        } elseif ($user->hasRole('admin')) {
            return redirect()->intended('/admin/dashboard');
        } elseif ($user->hasRole('residentuser') || $user->hasRole('user')) {
            return redirect()->intended('/residentuser/dashboard');
        }

        return redirect()->intended('/dashboard');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
