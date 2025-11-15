<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Announcements;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    // List all announcements
    public function index()
    {
        $announcements = Announcements::latest()->paginate(6);
        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
        ]);
    }

    // Create form
    public function create()
    {
        return Inertia::render('Admin/Announcements/Create');
    }

    // Store announcement
    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:25',
            'message'      => 'required|string|max:255',
            'type'         => 'required|in:general,urgent',
            'meeting_date' => 'nullable|date|after_or_equal:today',
        ]);

        Announcements::create($request->only(['title', 'message', 'type', 'meeting_date']));

        return redirect()->route('announcements.index')
            ->with('flash.message', 'Announcement created successfully!');
    }

    // Edit form
    public function edit(Announcements $announcement)
    {
        return Inertia::render('Admin/Announcements/Edit', [
            'announcement' => $announcement,
        ]);
    }

    // Update
    public function update(Request $request, Announcements $announcement)
    {
        $request->validate([
            'title'        => 'required|string|max:25',
            'message'      => 'required|string|max:255',
            'type'         => 'required|in:general,urgent',
            'meeting_date' => 'nullable|date|after_or_equal:today',
        ]);

        $announcement->update($request->only(['title', 'message', 'type', 'meeting_date']));

        return redirect()->route('announcements.index')
            ->with('flash.message', 'Announcement updated successfully!');
    }

    // Delete
    public function destroy(Announcements $announcement)
    {
        $announcement->delete();

        return redirect()->route('announcements.index')
            ->with('flash.message', 'Announcement deleted successfully!');
    }
}
