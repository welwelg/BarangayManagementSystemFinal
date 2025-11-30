<?php

namespace App\Http\Controllers\ResidentUser;

use App\Http\Controllers\Controller;
use App\Models\Blotter;
use Illuminate\Http\Request;
use Inertia\Inertia;



class BlotterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blotters = Blotter::where('user_id', auth()->id())
            ->with('approvedBy:id,name')
            ->latest()
            ->paginate(10);
        return Inertia::render('ResidentUser/Blotter/Index',[
            'blotters' => $blotters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ResidentUser/Blotter/Create');
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
        //
    }
}
