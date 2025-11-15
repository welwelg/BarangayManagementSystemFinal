<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Announcements;
use App\Models\Admin\Resident;
use App\Models\DisasterReport;
use App\Models\ResidentUser\Complaint;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = $this->getAdvancedStats();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    private function getAdvancedStats()
    {
        $totalZones = Resident::select('zone')->distinct()->count();

        $latestZones = Resident::selectRaw('zone, COUNT(*) as count')
            ->groupBy('zone')
            ->orderByDesc('zone')
            ->take(5)
            ->pluck('count', 'zone');

        return [
            'total_residents'          => Resident::count(),
            'male_residents'           => Resident::where('gender', 'male')->count(),
            'female_residents'         => Resident::where('gender', 'female')->count(),
            'total_zones'              => $totalZones,
            'residents_by_zone'        => $latestZones,
            'average_age'              => round(Resident::avg('age'), 1),
            'total_announcements'      => Announcements::count(),
            'latest_announcements'     => Announcements::latest()->take(5)->get(),
            'pending_complaints'       => Complaint::where('status', 'pending')->count(),
            'pending_disaster_reports' => DisasterReport::where('status', 'pending')->count(),
            'recent_activities'        => $this->getRecentActivities(),
        ];

    }

    private function getRecentActivities()
    {
        $activities = [];

        // ✅ Last 2 residents
        $recentResidents = Resident::latest()
            ->take(2)
            ->get(['first_name', 'last_name', 'created_at']);

        foreach ($recentResidents as $resident) {
            $activities[] = [
                'title'       => 'New Resident Added',
                'description' => "{$resident->first_name} {$resident->last_name} was added to the resident list of Barangay Rizal",
                'time' => $resident->created_at->diffForHumans(),
            ];
        }

        // ✅ Latest 3 disaster reports
        $recentDisasterReports = DisasterReport::with('user')
            ->latest()
            ->take(3)
            ->get(['disaster_type', 'status', 'created_at', 'user_id']);

        foreach ($recentDisasterReports as $report) {
            $activities[] = [
                'title'       => 'New Disaster Report',
                'description' => ucfirst($report->disaster_type) . ' reported - Status: ' . ucfirst($report->status),
                'time'        => $report->created_at->diffForHumans(),
            ];
        }

        // ✅ Sort by most recent time if needed
        usort($activities, function ($a, $b) {
            return strcmp($b['time'], $a['time']);
        });

        return array_slice($activities, 0, 10);
    }
}
