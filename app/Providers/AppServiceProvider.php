<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Global share for Inertia (auth user + roles + permissions)
        Inertia::share([
            'auth' => fn() => auth()->check()
            ? [
                'id'          => auth()->id(),
                'name'        => auth()->user()->name,
                'email'       => auth()->user()->email,
                'roles'       => auth()->user()->getRoleNames(), // roles from Spatie
                'permissions' => auth()->user()->getAllPermissions()->pluck('name'),
            ]
            : null,
        ]);

        Inertia::share([
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error'   => session('error'),
                ];
            },
        ]);

    }
}
