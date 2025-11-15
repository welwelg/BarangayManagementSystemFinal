<?php
namespace App\Http\Controllers\Admin;

use App\Exports\ResidentsExport;
use App\Http\Controllers\Controller;
use App\Imports\ResidentsImport;
use App\Models\Admin\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $residents = Resident::latest()->paginate(10);

        return Inertia::render('Admin/Residents/Index', [
            'residents' => $residents,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Residents/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'   => 'required|string|max:20',
            'middle_name'  => 'nullable|string|max:20',
            'last_name'    => 'required|string|max:20',
            'suffix'       => 'nullable|string|max:10',
            'age'          => 'required|integer|min:1|max:120',
            'gender'       => 'required|string|in:male,female,other',
            'zone'         => 'required|string|max:20',
            'household_no' => 'required|string|max:50',
            'contact_no'   => 'required|string|max:11|unique:residents,contact_no',
            'email'        => 'nullable|string|email|max:255|unique:residents,email',
        ]);

        Resident::create($validated);

        return redirect()->route('admin.residents.index')
            ->with('flash.message', 'Resident added successfully!');

    }

    /**
     * Display the specified resource.
     */
    public function show(Resident $resident)
    {
        return Inertia::render('Admin/Residents/Show', [
            'resident' => $resident,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resident $resident)
    {
        return Inertia::render('Admin/Residents/Edit', [
            'resident' => $resident,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Resident $resident)
    {
        $validated = $request->validate([
            'first_name'   => 'required|string|max:20',
            'middle_name'  => 'nullable|string|max:20',
            'last_name'    => 'required|string|max:20',
            'suffix'       => 'nullable|string|max:10',
            'age'          => 'required|integer|min:1|max:120',
            'gender'       => 'required|string|in:male,female,other',
            'zone'         => 'required|string|max:20',
            'household_no' => 'required|string|max:50',
            'contact_no'   => 'required|string|max:11|unique:residents,contact_no,' . $resident->id,
            'email'        => 'nullable|string|email|max:255|unique:residents,email,' . $resident->id,

        ]);

        $resident->update($validated);

        return redirect()->route('admin.residents.index')
            ->with('flash.message', 'Resident updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resident $resident)
    {
        $resident->delete();

        return redirect()->route('admin.residents.index')
            ->with('flash.message', 'Resident deleted successfully!');

    }

    public function export()
    {
        return Excel::download(new ResidentsExport, 'residents.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        try {
            $import = new ResidentsImport();
            Excel::import($import, $request->file('file'));

            // Check for failures
            $failures = $import->failures();

            if ($failures->isNotEmpty()) {
                $errorMessages = [];
                foreach ($failures->take(5) as $failure) {
                    $errorMessages[] = "Row {$failure->row()}: " . implode(', ', $failure->errors());
                }

                return back()->with('flash', [
                    'message' => 'Import completed with errors: ' . implode(' | ', $errorMessages),
                    'type'    => 'error',
                ]);
            }

            return redirect()->route('admin.residents.index')
                ->with('flash', [
                    'message' => 'Residents imported successfully!',
                    'type'    => 'success',
                ]);
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures      = $e->failures();
            $errorMessages = [];

            foreach ($failures->take(5) as $failure) {
                $errorMessages[] = "Row {$failure->row()}: " . implode(', ', $failure->errors());
            }

            return back()->with('flash', [
                'message' => 'Validation errors: ' . implode(' | ', $errorMessages),
                'type'    => 'error',
            ]);
        } catch (\Exception $e) {
            return back()->with('flash', [
                'message' => 'Import failed: ' . $e->getMessage(),
                'type'    => 'error',
            ]);
        }
    }
}
