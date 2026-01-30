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
    public function index(Request $request)
    {
        // 1. Initialize Query
        $query = Resident::query();

        // 2. Search Filter (Server-Side)
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('contact_no', 'like', "%{$search}%");
            });
        }

        // 3. Gender Filter (Server-Side)
        if ($request->filled('gender') && $request->input('gender') !== 'all') {
            $query->where('gender', strtolower($request->input('gender')));
        }

        // 4. Get Global Counts (Use DB counts, not array length)
        $totalResidents = Resident::count();
        $totalMale = Resident::where('gender', 'male')->count();
        $totalFemale = Resident::where('gender', 'female')->count();

        // 5. Paginate and append query params
        $residents = $query->orderBy('last_name', 'asc')
                           ->paginate(10)
                           ->withQueryString();

        return Inertia::render('Admin/Residents/Index', [
            'residents' => $residents,
            'total_residents_count' => $totalResidents,
            'total_male' => $totalMale,
            'total_female' => $totalFemale,
            'filters' => $request->only(['search', 'gender']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Residents/Create');
    }

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

    public function show(Resident $resident)
    {
        return Inertia::render('Admin/Residents/Show', [
            'resident' => $resident,
        ]);
    }

    public function edit(Resident $resident)
    {
        return Inertia::render('Admin/Residents/Edit', [
            'resident' => $resident,
        ]);
    }

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

            $failures = $import->failures();

            if ($failures->isNotEmpty()) {
                $errorMessages = [];
                foreach ($failures as $failure) {
                    $errorMessages[] = "Row " . $failure->row() . ": " . implode(', ', $failure->errors());
                }
                return back()->withErrors(['file' => implode(' | ', $errorMessages)]);
            }

            return redirect()->route('admin.residents.index')
                ->with('flash', [
                    'message' => 'Residents imported successfully!',
                    'type'    => 'success',
                ]);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errorMessages = [];

            foreach (collect($failures)->take(5) as $failure) {
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
