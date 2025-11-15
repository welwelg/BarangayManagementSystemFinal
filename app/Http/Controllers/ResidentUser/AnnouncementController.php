<?php
namespace App\Http\Controllers\ResidentUser;

use App\Http\Controllers\Controller;
use App\Models\Admin\Announcements;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $announcements = Announcements::latest()->paginate(12);

        return Inertia::render('ResidentUser/Announcement/Index', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $announcement = Announcements::findOrFail($id);

        return Inertia::render('ResidentUser/Announcement/Show', [
            'announcement' => $announcement,
        ]);
    }
}
