<?php

namespace App\Http\Controllers\ResidentUser;

use App\Http\Controllers\Controller;
use App\Models\Blotter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BlotterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();

        // 1. Fetch Blotters
        $blotters = Blotter::where('user_id', $userId)
            ->with('approvedBy:id,name')
            ->latest()
            ->paginate(10);

        // 2. Calculate Stats for the Dashboard Cards
        $stats = [
            'total'    => Blotter::where('user_id', $userId)->count(),
            'pending'  => Blotter::where('user_id', $userId)->where('status', 'pending')->count(),
            'resolved' => Blotter::where('user_id', $userId)->where('status', 'settled')->count(),
        ];

        return Inertia::render('ResidentUser/Blotter/Index', [
            'blotters' => $blotters,
            'stats'    => $stats, // ✅ Pass stats to the view
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::where('id', '!=', Auth::id())
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('ResidentUser/Blotter/Create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type'               => 'required|string|max:255',
            'description'        => 'required|string',
            'respondent_name'    => 'nullable|string|max:255',
            'respondent_user_id' => 'nullable|exists:users,id',
        ]);

        Blotter::create([
            'user_id'            => Auth::id(),
            'type'               => $validated['type'],
            'description'        => $validated['description'],
            'respondent_user_id' => $validated['respondent_user_id'] ?? null,
            'respondent_name'    => $validated['respondent_name'] ?? null,
            'status'             => 'pending',
        ]);

        return redirect()->route('residentuser.blotter.index')
            ->with('success', 'Blotter report submitted successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $blotter = Blotter::with('user', 'approvedBy')->findOrFail($id);

        if ($blotter->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('ResidentUser/Blotter/Show', [
            'blotter' => $blotter
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $blotter = Blotter::findOrFail($id);

        if (Auth::id() !== $blotter->user_id) {
            abort(403);
        }

        if ($blotter->status !== 'pending') {
            return redirect()->route('residentuser.blotter.index')
                ->with('error', 'You cannot edit a report that has already been processed.');
        }

        $users = User::where('id', '!=', Auth::id())
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('ResidentUser/Blotter/Edit', [
            'blotter' => $blotter,
            'users'   => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $blotter = Blotter::findOrFail($id);

        if (Auth::id() !== $blotter->user_id) {
            abort(403, 'Unauthorized action.');
        }

        if ($blotter->status !== 'pending') {
            return back()->with('error', 'You cannot edit a report that has already been processed by the Admin.');
        }

        $validated = $request->validate([
            'type'               => 'required|string|max:255',
            'description'        => 'required|string',
            'respondent_name'    => 'nullable|string|max:255',
            'respondent_user_id' => 'nullable|exists:users,id',
        ]);

        $blotter->update([
            'type'               => $validated['type'],
            'description'        => $validated['description'],
            'respondent_name'    => $validated['respondent_name'] ?? null,
            'respondent_user_id' => $validated['respondent_user_id'] ?? null,
        ]);

        return redirect()->route('residentuser.blotter.index')
            ->with('success', 'Blotter report updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $blotter = Blotter::findOrFail($id);

        if ($blotter->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($blotter->status !== 'pending') {
            return back()->with('error', 'You cannot delete a report that has already been processed.');
        }

        $blotter->delete();

        return redirect()->route('residentuser.blotter.index')
            ->with('success', 'Blotter report deleted successfully.');
    }
}
