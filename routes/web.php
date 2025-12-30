<?php

use App\Http\Controllers\Admin\ResidentController;
use App\Http\Controllers\Admin\BlotterController;

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\PermissionManagementController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Authenticated & Verified Routes
Route::middleware(['auth', 'verified'])->group(function () {

    //Broadcast::routes(['middleware' => ['auth:sanctum']]);
    Broadcast::routes(['middleware' => ['web', 'auth']]);

    // Default Dashboard (fallback)
    Route::get('dashboard', fn() => Inertia::render('dashboard'))->name('dashboard');

    // ===============================
    // 👥 USER MANAGEMENT ROUTES
    // ===============================
    Route::resource('users', UserController::class)
        ->only(['create', 'store'])->middleware('permission:users.create');

    Route::resource('users', UserController::class)
        ->only(['edit', 'update'])->middleware('permission:users.edit');

    Route::resource('users', UserController::class)
        ->only(['destroy'])->middleware('permission:users.delete');

    Route::resource('users', UserController::class)
        ->only(['index', 'show'])->middleware('permission:users.view|users.create|users.edit|users.delete');

    // ===============================
    // 🛡️ ROLE MANAGEMENT ROUTES
    // ===============================
    Route::resource('roles', RoleController::class)
        ->only(['create', 'store', 'edit', 'update', 'destroy'])
        ->middleware('role:superadmin');

    Route::resource('roles', RoleController::class)
        ->only(['index', 'show'])
        ->middleware('permission:roles.view');

});

// ===============================
// 👑 SUPER ADMIN DASHBOARD
// ===============================
Route::middleware(['role:superadmin'])->group(function () {
    Route::get('/superadmin/dashboard', fn() => Inertia::render('SuperAdmin/Dashboard'))->name('superadmin.dashboard');

    Route::prefix('permission')->name('permission.')->group(function () {
        Route::get('/', [PermissionManagementController::class, 'index'])->name('index');
        Route::post('/', [PermissionManagementController::class, 'store'])->name('store');
        Route::post('/generate', [PermissionManagementController::class, 'generateFromNavigation'])->name('generate');
        Route::post('/roles/{role}', [PermissionManagementController::class, 'updateRolePermissions'])->name('update-role');
        Route::delete('/{permission}', [PermissionManagementController::class, 'destroy'])->name('destroy');
    });

});

// ===============================
// 🏛️ BARANGAY ADMIN DASHBOARD
// ===============================
Route::middleware(['role:admin|superadmin'])->group(function () {

    // Admin Dashboard
    Route::get('/admin/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->middleware('permission:admin-dashboard.view')
        ->name('admin.dashboard');

    //Analytics
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');

    // ===============================
    // 📧 MESSAGE ROUTES
    // ===============================
    Route::resource('/admin/message', App\Http\Controllers\Admin\MessageController::class, [
        'names' => [
            'index'   => 'admin.message.index',
            'create'  => 'admin.message.create',
            'store'   => 'admin.message.store',
            'show'    => 'admin.message.show',
            'edit'    => 'admin.message.edit',
            'update'  => 'admin.message.update',
            'destroy' => 'admin.message.destroy',
        ],
    ])->middleware([
        'index'   => 'permission:message.view',
        'create'  => 'permission:message.create',
        'store'   => 'permission:message.create',
        'show'    => 'permission:message.view',
        'destroy' => 'permission:message.delete',
    ]);

    Route::post('/admin/message/{message}/mark-read', [App\Http\Controllers\Admin\MessageController::class, 'markAsRead'])
        ->middleware('permission:message.view')
        ->name('admin.message.mark-read');

    Route::match(['get', 'post'], '/admin/message-broadcast', [App\Http\Controllers\Admin\MessageController::class, 'broadcast'])
        ->middleware('permission:message.create')
        ->name('admin.message.broadcast');

    // ===============================
    // 👥 RESIDENTS ROUTES
    // ===============================
    Route::get('/admin/residents/export', [ResidentController::class, 'export'])
        ->middleware('permission:residents.view')
        ->name('admin.residents.export');

    Route::post('/admin/residents/import', [ResidentController::class, 'import'])
        ->middleware('permission:residents.create')
        ->name('admin.residents.import');

    Route::resource('/admin/residents', App\Http\Controllers\Admin\ResidentController::class, [
        'names' => [
            'index'   => 'admin.residents.index',
            'create'  => 'admin.residents.create',
            'store'   => 'admin.residents.store',
            'edit'    => 'admin.residents.edit',
            'update'  => 'admin.residents.update',
            'destroy' => 'admin.residents.destroy',
        ],
    ])->middleware([
        'index'   => 'permission:residents.view',
        'create'  => 'permission:residents.create',
        'store'   => 'permission:residents.create',
        'show'    => 'permission:residents.view',
        'edit'    => 'permission:residents.edit',
        'update'  => 'permission:residents.edit',
        'destroy' => 'permission:residents.delete',
    ]);

    // ===============================
    // 📢 ANNOUNCEMENTS ROUTES
    // ===============================
    Route::resource('/admin/announcements', App\Http\Controllers\Admin\AnnouncementController::class)
        ->middleware([
            'index'   => 'permission:announcements.view',
            'create'  => 'permission:announcements.create',
            'store'   => 'permission:announcements.create',
            'show'    => 'permission:announcements.view',
            'edit'    => 'permission:announcements.edit',
            'update'  => 'permission:announcements.edit',
            'destroy' => 'permission:announcements.delete',
        ]);

    // ===============================
    // 🗣️ COMPLAINTS ROUTES
    // ===============================
    Route::resource('/admin/complaints', App\Http\Controllers\Admin\ComplaintController::class)
        ->middleware([
            'index'   => 'permission:complaints.view',
            'create'  => 'permission:complaints.create',
            'store'   => 'permission:complaints.create',
            'show'    => 'permission:complaints.view',
            'edit'    => 'permission:complaints.edit',
            'update'  => 'permission:complaints.edit',
            'destroy' => 'permission:complaints.delete',
        ]);

    Route::put('/admin/complaints/{complaint}/assign', [App\Http\Controllers\Admin\ComplaintController::class, 'assign'])
        ->middleware('permission:complaints.edit')
        ->name('admin.complaints.assign');

    Route::put('/admin/complaints/{complaint}/resolve', [App\Http\Controllers\Admin\ComplaintController::class, 'resolve'])
        ->middleware('permission:complaints.edit')
        ->name('admin.complaints.resolve');

    // ===============================
    // 🚨 DISASTER REPORTS ROUTES
    // ===============================
    Route::resource('/admin/disaster-reports', App\Http\Controllers\Admin\DisasterReportController::class, [
        'names' => [
            'index'   => 'admin.disaster-reports.index',
            'create'  => 'admin.disaster-reports.create',
            'store'   => 'admin.disaster-reports.store',
            'show'    => 'admin.disaster-reports.show',
            'edit'    => 'admin.disaster-reports.edit',
            'update'  => 'admin.disaster-reports.update',
            'destroy' => 'admin.disaster-reports.destroy',
        ],
    ])->middleware([
        'index'   => 'permission:disaster-reports.view',
        'create'  => 'permission:disaster-reports.create',
        'store'   => 'permission:disaster-reports.create',
        'show'    => 'permission:disaster-reports.view',
        'edit'    => 'permission:disaster-reports.edit',
        'update'  => 'permission:disaster-reports.edit',
        'destroy' => 'permission:disaster-reports.delete',
    ]);

    Route::post('/admin/disaster-reports/{id}/resolve', [App\Http\Controllers\Admin\DisasterReportController::class, 'resolve'])
        ->middleware('permission:disaster-reports.edit')
        ->name('admin.disaster-reports.resolve');

    // ===============================
    // 🚨 Typhoon ROUTES
    // ===============================
    Route::prefix('admin')->group(function () {
        Route::get('/typhoon-monitoring', [App\Http\Controllers\Admin\TyphoonController::class, 'index']);
        Route::get('/typhoon/data', [App\Http\Controllers\Admin\TyphoonController::class, 'fetchTyphoonData']);
        Route::get('/typhoon/forecast', [App\Http\Controllers\Admin\TyphoonController::class, 'fetchWeeklyForecast']);
    });

    // ===============================
    // 📋 BLOTTER ROUTES (Admin)
    // ===============================
    Route::resource('/admin/blotter', App\Http\Controllers\Admin\BlotterController::class, [
        'names' => [
            'index'   => 'admin.blotter.index',
            'create'  => 'admin.blotter.create',
            'store'   => 'admin.blotter.store',
            'show'    => 'admin.blotter.show',
            'edit'    => 'admin.blotter.edit',
            'update'  => 'admin.blotter.update',
            'destroy' => 'admin.blotter.destroy',
        ],
    ])->middleware([
        'index'   => 'permission:blotter.view',
        'create'  => 'permission:blotter.create',
        'store'   => 'permission:blotter.create',
        'show'    => 'permission:blotter.view',
        'edit'    => 'permission:blotter.edit',
        'update'  => 'permission:blotter.edit',
        'destroy' => 'permission:blotter.delete',
    ]);

    Route::put('/admin/blotter/{blotter}/status', [BlotterController::class, 'updateStatus'])
    ->name('admin.blotter.update-status');

    Route::put('/admin/blotter/{blotter}/approve', [App\Http\Controllers\Admin\BlotterController::class, 'approve'])
        ->middleware('permission:blotter.edit')
        ->name('admin.blotter.approve');

    Route::put('/admin/blotter/{blotter}/reject', [App\Http\Controllers\Admin\BlotterController::class, 'reject'])
        ->middleware('permission:blotter.edit')
        ->name('admin.blotter.reject');
});

// ===============================
// 👤 RESIDENT USER DASHBOARD
// ===============================
Route::middleware(['role:user'])->group(function () {

    // Dashboard
    Route::get('/residentuser/dashboard', [App\Http\Controllers\ResidentUser\DashboardController::class, 'index'])
        ->middleware('permission:resident-dashboard.view')
        ->name('residentuser.dashboard');

    // ===============================
    // 📧 MESSAGE ROUTES (Resident User)
    // ===============================
    Route::resource('/residentuser/message', App\Http\Controllers\ResidentUser\MessageController::class, [
        'names' => [
            'index'   => 'residentuser.message.index',
            'create'  => 'residentuser.message.create',
            'store'   => 'residentuser.message.store',
            'show'    => 'residentuser.message.show',
            'edit'    => 'residentuser.message.edit',
            'update'  => 'residentuser.message.update',
            'destroy' => 'residentuser.message.destroy',
        ],
    ])->middleware([
        'index'   => 'permission:residentuser-message.view',
        'create'  => 'permission:residentuser-message.create',
        'store'   => 'permission:residentuser-message.create',
        'show'    => 'permission:residentuser-message.view',
        'destroy' => 'permission:residentuser-message.delete',
    ]);

    Route::post('/residentuser/message/{message}/mark-read', [App\Http\Controllers\ResidentUser\MessageController::class, 'markAsRead'])
        ->middleware('permission:residentuser-message.view')
        ->name('residentuser.message.mark-read');

    // ===============================
    // 📢 ANNOUNCEMENTS (Resident User)
    // ===============================
    Route::get('/residentuser/announcements', [App\Http\Controllers\ResidentUser\AnnouncementController::class, 'index'])
        ->middleware('permission:residentuser-announcements.view')
        ->name('residentuser.announcements');

    // ===============================
    // 📝 REQUESTS (Resident User)
    // ===============================
    Route::resource('/residentuser/requests', App\Http\Controllers\ResidentUser\RequestController::class)
        ->middleware([
            'index'   => 'permission:residentuser-requests.view',
            'create'  => 'permission:residentuser-requests.create',
            'store'   => 'permission:residentuser-requests.create',
            'show'    => 'permission:residentuser-requests.view',
            'edit'    => 'permission:residentuser-requests.edit',
            'update'  => 'permission:residentuser-requests.edit',
            'destroy' => 'permission:residentuser-requests.delete',
        ]);

    // ===============================
    // 🗣️ COMPLAINTS (Resident User)
    // ===============================
    Route::resource('/residentuser/complaints', App\Http\Controllers\ResidentUser\ComplaintController::class, [
        'names' => [
            'index'   => 'residentuser.complaints.index',
            'create'  => 'residentuser.complaints.create',
            'store'   => 'residentuser.complaints.store',
            'show'    => 'residentuser.complaints.show',
            'edit'    => 'residentuser.complaints.edit',
            'update'  => 'residentuser.complaints.update',
            'destroy' => 'residentuser.complaints.destroy',
        ],
    ])->middleware([
        'index'   => 'permission:residentuser-complaints.view',
        'create'  => 'permission:residentuser-complaints.create',
        'store'   => 'permission:residentuser-complaints.create',
        'show'    => 'permission:residentuser-complaints.view',
        'edit'    => 'permission:residentuser-complaints.edit',
        'update'  => 'permission:residentuser-complaints.edit',
        'destroy' => 'permission:residentuser-complaints.delete',
    ]);

    // ===============================
    // 🚨 DISASTER REPORTS (Resident User)
    // ===============================
    Route::resource('/residentuser/disaster-reports', App\Http\Controllers\ResidentUser\DisasterReportController::class)
        ->middleware([
            'index'   => 'permission:residentuser-disaster-reports.view',
            'create'  => 'permission:residentuser-disaster-reports.create',
            'store'   => 'permission:residentuser-disaster-reports.create',
            'show'    => 'permission:residentuser-disaster-reports.view',
            'edit'    => 'permission:residentuser-disaster-reports.edit',
            'update'  => 'permission:residentuser-disaster-reports.edit',
            'destroy' => 'permission:residentuser-disaster-reports.delete',
        ]);

    // ===============================
    // 🚨 Typhoon ROUTES
    // ===============================
    Route::get('/residentuser/typhoon-monitoring', [App\Http\Controllers\ResidentUser\TyphoonController::class, 'index']);
    Route::get('/typhoon/data', [App\Http\Controllers\ResidentUser\TyphoonController::class, 'fetchTyphoonData']);
    Route::get('/typhoon/forecast', [App\Http\Controllers\ResidentUser\TyphoonController::class, 'fetchWeeklyForecast']);

    // ===============================
    // 📋 BLOTTER ROUTES (RESIDENTUSER/USER)
    // ===============================
   Route::resource('/residentuser/blotter', App\Http\Controllers\ResidentUser\BlotterController::class, [
        'names' => [
            'index'   => 'residentuser.blotter.index',
            'create'  => 'residentuser.blotter.create',
            'store'   => 'residentuser.blotter.store',
            'show'    => 'residentuser.blotter.show',
            'edit'    => 'residentuser.blotter.edit',
            'update'  => 'residentuser.blotter.update',
            'destroy' => 'residentuser.blotter.destroy',
        ],
    ])->middleware([
        'index'   => 'permission:residentuser-blotter.view',
        'create'  => 'permission:residentuser-blotter.create',
        'store'   => 'permission:residentuser-blotter.create',
        'show'    => 'permission:residentuser-blotter.view',
        'edit'    => 'permission:residentuser-blotter.edit',
        'update'  => 'permission:residentuser-blotter.edit',
        'destroy' => 'permission:residentuser-blotter.delete',
    ]);
});

// ===============================
// 👤 BASIC USER DASHBOARD (Fallback)
// ===============================
Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/user', fn() => Inertia::render('User/Dashboard'))->name('user.dashboard');
});

// ===============================
// ⚙️ OTHER ROUTE FILES
// ===============================
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
