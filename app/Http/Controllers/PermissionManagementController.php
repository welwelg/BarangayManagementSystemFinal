<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionManagementController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();

        // Group permissions by resource (everything except last part which is the action)
        $permissions = Permission::all()->groupBy(function ($permission) {
            $parts = explode('.', $permission->name);
            array_pop($parts);           // Remove action part
            return implode('.', $parts); // Return resource part
        });

        return inertia('SuperAdmin/Permission/Index', [
            'permissions' => $permissions,
            'roles'       => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'unique:permissions,name',
                'regex:/^[a-z]+(\.[a-z\-]+)+\.[a-z]+$/', // ✅ Allow multiple dots
            ],
        ], [
            'name.regex' => 'Permission must be in format: resource.action (e.g., admin.users.view)',
        ]);

        Permission::create([
            'name'       => $validated['name'],
            'guard_name' => 'web',
        ]);

        return redirect()->back()->with('flash.message', 'Permission created successfully!');
    }

    public function updateRolePermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions'   => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->syncPermissions($validated['permissions']);

        return redirect()->back()->with('flash.message', "Permissions updated for {$role->name} role!");
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return redirect()->back()->with('flash.message', 'Permission deleted successfully!');
    }

    public function generateFromNavigation(Request $request)
    {
        $validated = $request->validate([
            'navigation_items'            => 'required|array',
            'navigation_items.*.resource' => 'required|string',
            'navigation_items.*.actions'  => 'required|array',
        ]);

        $created = 0;
        $skipped = 0;

        foreach ($validated['navigation_items'] as $item) {
            $resource = $item['resource'];
            $actions  = $item['actions'];

            foreach ($actions as $action) {
                $permissionName = "{$resource}.{$action}";

                $permission = Permission::firstOrCreate(
                    ['name' => $permissionName, 'guard_name' => 'web']
                );

                if ($permission->wasRecentlyCreated) {
                    $created++;
                } else {
                    $skipped++;
                }
            }
        }

        return redirect()->back()->with('flash.message', "Generated {$created} permissions, skipped {$skipped} existing.");
    }
}
