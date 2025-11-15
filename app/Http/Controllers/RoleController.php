<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = auth()->user()?->hasRole('superadmin')
            ? Role::with('permissions')->get()
            : Role::where('name', '!=', 'superadmin')->with('permissions')->get();

        return Inertia::render('SuperAdmin/Roles/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SuperAdmin/Roles/Create', [
            'permissions' => Permission::pluck('name'),
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Security: prevent non-superadmin users from creating the superadmin role
        if ($request->name === 'superadmin' && ! $request->user()->hasRole('superadmin')) {
            abort(403, 'Not allowed to create superadmin role.');
        }

        // Validate modal inputs
        $validated = $request->validate([
            'name'          => 'required|string|max:255|unique:roles,name',
            'permissions'   => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('roles.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::findOrFail($id);
        if ($role->name === 'superadmin' && ! auth()->user()?->hasRole('superadmin')) {
            abort(403);
        }
        return Inertia::render('SuperAdmin/Roles/Show', [
            'role'        => $role,
            'permissions' => $role->permissions->pluck('name'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $role = Role::findOrFail($id);
        if ($role->name === 'superadmin' && ! auth()->user()?->hasRole('superadmin')) {
            abort(403);
        }
        return Inertia::render('SuperAdmin/Roles/Edit', [
            'role'            => $role,
            'rolePermissions' => $role->permissions->pluck('name'),
            'permissions'     => Permission::pluck('name'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $role = Role::findOrFail($id);

        //  Security: prevent non-superadmin users from touching superadmin role
        if (($role->name === 'superadmin' || $request->name === 'superadmin') && ! $request->user()->hasRole('superadmin')) {
            abort(403, 'You are not allowed to modify the superadmin role.');
        }

        $validated = $request->validate([
            'name'          => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions'   => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role->update(['name' => $validated['name']]);

        // If you’re updating permissions via modal
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->route('roles.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        if ($role->name === 'superadmin' && ! auth()->user()?->hasRole('superadmin')) {
            abort(403);
        }
        $role->delete();
        return to_route('roles.index');
    }
}
