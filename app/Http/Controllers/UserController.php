<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get();
        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => Role::pluck('name'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'floating_name'            => 'required|string|max:255',
            'floating_email'           => 'required|email|unique:users,email',
            'floating_password'        => 'required|min:6',
            'floating_repeat_password' => 'required|same:floating_password',
        ]);

        $user = User::create([
            'name'     => $request->floating_name,
            'email'    => $request->floating_email,
            'password' => Hash::make($request->floating_password),
            'role'     => 'user',   // Default role
            'status'   => 'active', // Default status
        ]);

        if ($request->has('roles') && ! empty($request->roles)) {
            $user->syncRoles($request->roles);
        }

        // Redirect back to create page with success message
        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');

    }

    public function show(string $id)
    {
        return Inertia::render('Users/Show', [
            'user'      => User::find($id),
            'userRoles' => User::find($id)->roles->pluck('name'),
            'roles'     => Role::pluck('name'),
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find($id);
        return Inertia::render('Users/Edit', [
            'user'      => $user,
            'userRoles' => $user->roles->pluck('name'),
            'roles'     => Role::pluck('name'),

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        // Validate the request with proper unique email rule
        $request->validate([
            'floating_name'            => 'required|string|max:255',
            'floating_email'           => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'floating_password'        => 'nullable|min:6',
            'floating_repeat_password' => 'nullable|same:floating_password',
        ]);

        // Find and update the user (REMOVED the User::create() line!)
        $user        = User::find($id);
        $user->name  = $request->floating_name;
        $user->email = $request->floating_email;

        // Only update password if provided
        if ($request->filled('floating_password')) {
            $user->password = Hash::make($request->floating_password);
        }

        $user->save();
        $user->syncRoles($request->roles);

        return to_route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        User::destroy($id);
        return to_route('users.index');
    }
}
