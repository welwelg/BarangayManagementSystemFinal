<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            "users.view",
            "users.edit",
            "users.create",
            "users.delete",
            "roles.view",
            "roles.edit",
            "roles.create",
            "roles.delete",
        ];
        foreach ($permissions as $key => $value) {
            Permission::create(['name' => $value]);
        }
    }
}
