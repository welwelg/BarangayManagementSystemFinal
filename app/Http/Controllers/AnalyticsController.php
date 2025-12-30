<?php

namespace App\Http\Controllers;

use App\Models\Blotter;use App\Models\DisasterReport;
use App\Models\ResidentUser\Complaint;

use Inertia\Inertia;
use Carbon\Carbon;


class AnalyticsController extends Controller
{
    public function index()
    {
        // helper function to get 6-month trend
        $getTrend = function ($modelClass) {
            return $modelClass::selectRaw('DATE_FORMAT(created_at, "%b") as month, COUNT(*) as count, MIN(created_at) as sort_date')
                ->where('created_at', '>=', Carbon::now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('sort_date')
                ->get()
                ->map(fn($item) => [
                    'month' => $item->month, // e.g., "Jan"
                    'count' => $item->count
                ]);
        };

        return Inertia::render('SuperAdmin/Analytics/Index', [
            // We pass 3 datasets, one for each chart
            'blotterData' => $getTrend(Blotter::class),
            'complaintData' => $getTrend(Complaint::class),
            'disasterData' => $getTrend(DisasterReport::class),
        ]);
    }
}
