<?php
namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $superAdmin = \App\Models\User::factory()->create([
            'name'     => 'Super Admin',
            'email'    => 'superadmin@mail.com',
            'password' => Hash::make('Superadmin24*'),
        ]);
        $superAdmin->assignRole('superadmin');

        $admin = \App\Models\User::factory()->create([
            'name'     => 'Admin',
            'email'    => 'admin@mail.com',
            'password' => Hash::make('Admin24*'),
        ]);
        $admin->assignRole('admin');

        $user = \App\Models\User::factory()->create([
            'name'     => 'User',
            'email'    => 'user@gmail.com',
            'password' => Hash::make('password'),
        ]);
        $user->assignRole('user');

    }
}
