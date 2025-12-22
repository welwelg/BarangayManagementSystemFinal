<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blotter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\BlotterScheduled;
use Carbon\Carbon;


class BlotterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       // 1. Calculate Statistics
        $totalRequests = Blotter::count();
        $pendingRequests = Blotter::where('status', 'pending')->count();

        // 2. Fetch UPCOMING hearings
        // Logic: ONLY show hearings that are in the future relative to PH time
        $phTime = Carbon::now(config('app.timezone'));

        $upcomingHearingsRaw = Blotter::where('status', 'approved')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '>', $phTime) // Strict check: Date must be in future
            ->orderBy('scheduled_at', 'asc')
            ->take(5)
            ->get();

        // Format for frontend
        $upcomingHearings = $upcomingHearingsRaw->map(function ($blotter) {
            $date = Carbon::parse($blotter->scheduled_at)->setTimezone(config('app.timezone'));
            return [
                'id' => $blotter->id,
                'date' => $date->format('M d, Y'),
                'time' => $date->format('h:i A'),
                'respondent' => $blotter->respondent_name,
                'type' => $blotter->type,
            ];
        });

        // 3. Fetch the paginated list
        $blotters = Blotter::with('user')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Blotter/Index', [
            'blotters' => $blotters,
            'stats' => [
                'total' => $totalRequests,
                'pending' => $pendingRequests,
                'resolved' => Blotter::where('status', 'settled')->count(),
                'upcoming_hearings' => $upcomingHearings,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $blotter = Blotter::with('user')->findOrFail($id);
        return Inertia::render('Admin/Blotter/Show', [
            'blotter' => $blotter,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $blotter = Blotter::with('user')->findOrFail($id);
        return Inertia::render('Admin/Blotter/Edit', [
            'blotter' => $blotter,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $blotter = Blotter::findOrFail($id);

        $validated = $request->validate([
            'status'       => 'required|in:approved,rejected,pending,settled',
            'scheduled_at' => 'required_if:status,approved|nullable|date',
            'admin_notes'  => 'nullable|string',
        ]);

        $blotter->update([
            'status'       => $validated['status'],
            'scheduled_at' => $validated['status'] === 'approved' ? $validated['scheduled_at'] : null,
            'admin_notes'  => $validated['admin_notes'],
            'approved_by'  => Auth::id(),
        ]);

        if ($validated['status'] === 'approved' && $blotter->user && $blotter->user->email) {
             Mail::to($blotter->user)->send(new BlotterScheduled($blotter));
        }

        return redirect()->route('admin.blotter.index')
            ->with('success', 'Blotter status updated.');

    }


    public function updateStatus(Request $request, string $id)
    {
        $blotter = Blotter::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:approved,settled', // Only allow toggling resolved status
        ]);

        // Security: Don't allow this shortcut for Pending/Rejected items
        if ($blotter->status === 'pending' || $blotter->status === 'rejected') {
            return back()->with('error', 'Cannot use quick resolve on pending or rejected items.');
        }

        $blotter->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Blotter status updated successfully.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $blotter = Blotter::findOrFail($id);

        // Security: Only allow deletion if the case is Settled
        if ($blotter->status !== 'settled') {
            return back()->with('error', 'Only settled cases can be deleted.');
        }

        $blotter->delete();

        return back()->with('success', 'Blotter record deleted successfully.');
    }
}
