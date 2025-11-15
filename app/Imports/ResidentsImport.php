<?php
namespace App\Imports;

use App\Models\Admin\Resident;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ResidentsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure
{
    use SkipsErrors, SkipsFailures;

    public function model(array $row)
    {
        // Handle both snake_case and Title Case headers
        return new Resident([
            'first_name'   => $row['first_name'] ?? $row['First Name'] ?? null,
            'middle_name'  => $row['middle_name'] ?? $row['Middle Name'] ?? null,
            'last_name'    => $row['last_name'] ?? $row['Last Name'] ?? null,
            'suffix'       => $row['suffix'] ?? $row['Suffix'] ?? null,
            'age'          => $row['age'] ?? $row['Age'] ?? null,
            'gender'       => strtolower($row['gender'] ?? $row['Gender'] ?? ''),
            'zone'         => $row['zone'] ?? $row['Zone'] ?? null,
            'household_no' => $row['household_no'] ?? $row['Household No'] ?? $row['household_no'] ?? null,
            'contact_no'   => $row['contact_no'] ?? $row['Contact No'] ?? null,
            'email'        => $row['email'] ?? $row['Email'] ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.first_name'   => 'required|string|max:20',
            '*.middle_name'  => 'nullable|string|max:20',
            '*.last_name'    => 'required|string|max:20',
            '*.suffix'       => 'nullable|string|max:10',
            '*.age'          => 'required|integer|min:1|max:120',
            '*.gender'       => 'required|string|in:male,female,Male,Female,MALE,FEMALE',
            '*.zone'         => 'required|string|max:20',
            '*.household_no' => 'required|string|max:50',
            '*.contact_no'   => 'required|string|max:11',
            '*.email'        => 'nullable|string|email|max:255',
        ];
    }
}
