<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DisasterReport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DisasterReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Define what constitutes a "new" disaster report (within last 24 hours)
        $newThreshold = Carbon::now()->subHours(24);

        $query = DisasterReport::with('user')
            ->orderBy('created_at', 'desc');

        // Apply filters if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('disaster_type', 'like', "%{$search}%");
            });
        }

        // Paginate results (15 per page)
        $disasterReports = $query->paginate(10)
            ->through(function ($report) use ($newThreshold) {
                // Add a flag to identify new reports
                $report->is_new = $report->created_at >= $newThreshold;
                return $report;
            });

        return Inertia::render('Admin/Disaster/Index', [
            'disasterReports' => $disasterReports,
            'filters'         => [
                'search' => $request->search,
                'status' => $request->status,
            ],
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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $disasterReport = DisasterReport::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,in-progress,resolved',
        ]);

        $disasterReport->update([
            'status'      => $validated['status'],
            'resolved_at' => $validated['status'] === 'resolved' ? Carbon::now() : null,
        ]);

        return redirect()->route('admin.disaster-reports.index')->with('message', 'Disaster report status updated successfully.');
    }

    /**
     * Resolve a disaster report
     */
    public function resolve(string $id)
    {
        $disasterReport = DisasterReport::findOrFail($id);

        $disasterReport->update([
            'status'      => 'resolved',
            'resolved_at' => Carbon::now(),
        ]);

        return redirect()->route('admin.disaster-reports.index')->with('message', 'Disaster report has been resolved successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
