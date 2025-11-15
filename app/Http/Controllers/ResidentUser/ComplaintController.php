<?php
namespace App\Http\Controllers\ResidentUser;

use App\Http\Controllers\Controller;
use App\Models\ResidentUser\Complaint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $complaints = auth()->user()->complaints()->latest()->get();

        return Inertia::render('ResidentUser/Complaints/Index', [
            'complaints' => $complaints,

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ResidentUser/Complaints/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        auth()->user()->complaints()->create([
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => 'Pending',
        ]);

        return redirect()->route('residentuser.complaints.index')
            ->with('flash.message', 'Complaint created successfully!');

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
        $complaint = Complaint::findOrFail($id);

        return Inertia::render('ResidentUser/Complaints/Edit', [
            'complaint' => $complaint,
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->update([
            'title'       => $request->title,
            'description' => $request->description,
        ]);

        return redirect()->route('residentuser.complaints.index')
            ->with('flash.message', 'Complaint updated successfully!');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Complaint $complaint)
    {
        $complaint->delete();

        return redirect()->route('residentuser.complaints.index')
            ->with('flash.message', 'Complaint deleted successfully!');

    }
}
