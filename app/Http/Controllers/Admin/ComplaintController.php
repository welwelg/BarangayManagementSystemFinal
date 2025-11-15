<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResidentUser\Complaint;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Complaints/Index', [
            'complaints' => Complaint::with(['user', 'handler'])
                ->orderBy('created_at', 'desc')
                ->get(),
            'admins'     => User::role('admin')->get(['id', 'name']),
        ]);

    }

    public function assign(Request $request, Complaint $complaint)
    {
        $complaint->handler_id = $request->handler_id;
        $complaint->save();

        return back()->with('success', 'Handler assigned successfully.');
    }

    public function resolve(Complaint $complaint)
    {
        $complaint->status      = 'resolved';
        $complaint->resolved_at = now();
        $complaint->save();

        return back()->with('success', 'Complaint marked as resolved.');
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $complaint = Complaint::findOrFail($id);

// Only allow deletion of resolved complaints
        if ($complaint->status !== 'resolved') {
            return back()->with('flash', [
                'message' => 'Only resolved complaints can be deleted.',
                'type'    => 'error',
            ]);
        }

        $complaint->delete();

        return redirect()->route('complaints.index
')
            ->with('flash', [
                'message' => 'Complaint deleted successfully.',
                'type'    => 'success',
            ]);

    }
}
