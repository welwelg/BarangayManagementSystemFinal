<?php
namespace App\Http\Controllers\ResidentUser;

use App\Http\Controllers\Controller;
use App\Models\DisasterReport;
use Illuminate\Http\Request;

class DisasterReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $disasterReports = auth()->user()->disasterReports()
            ->select(['id', 'disaster_type', 'description', 'location', 'occurred_at', 'status', 'created_at', 'resolved_at'])
            ->latest()
            ->paginate(10);

        return inertia('ResidentUser/Disaster/Index', [
            'disasterReports' => $disasterReports,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('ResidentUser/Disaster/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'disaster_type' => 'required|string|max:255',
            'description'   => 'required|string',
            'location'      => 'required|string|max:255',
        ]);

        auth()->user()->disasterReports()->create([
            'disaster_type' => $request->disaster_type,
            'description'   => $request->description,
            'location'      => $request->location,
            'occurred_at'   => now(),     // Set to current time since not in form
            'status'        => 'pending', // Default status
        ]);

        return redirect()->route('disaster-reports.index')
            ->with('flash.message', 'Disaster report created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Changed from 'reported_by' to 'user_id'
        $disasterReport = DisasterReport::where('user_id', auth()->id())
            ->findOrFail($id);

        return inertia('ResidentUser/Disaster/Edit', [
            'disasterReport' => $disasterReport,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'disaster_type' => 'required|string|max:255',
            'description'   => 'required|string',
            'location'      => 'required|string|max:255',
        ]);

        // Changed from 'reported_by' to 'user_id'
        $disasterReport = DisasterReport::where('user_id', auth()->id())
            ->findOrFail($id);

        $disasterReport->update([
            'disaster_type' => $request->disaster_type,
            'description'   => $request->description,
            'location'      => $request->location,
        ]);

        return redirect()->route('disaster-reports.index')
            ->with('flash.message', 'Disaster report updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Hanapin ang disaster report ng kasalukuyang naka-login na user
        $disasterReport = DisasterReport::where('user_id', auth()->id())->findOrFail($id);

// I-delete ang report (kahit anong status — pending, in-progress, resolved)
        $disasterReport->delete();

// Redirect pabalik sa index page na may success message
        return redirect()->route('disaster-reports.index')
            ->with('flash.message', 'Disaster report deleted successfully!');

    }
}
