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
        return new Resident([
            // Use snake_case because WithHeadingRow converts headers automatically
            'first_name'   => $row['first_name'] ?? $row['First Name'] ?? null,
            'middle_name'  => $row['middle_name'] ?? $row['Middle Name'] ?? null,
            'last_name'    => $row['last_name'] ?? $row['Last Name'] ?? null,
            'suffix'       => $row['suffix'] ?? $row['Suffix'] ?? null,
            'age'          => $row['age'] ?? $row['Age'] ?? null,

            // Ensure lowercase for DB consistency (Male -> male)
            'gender'       => strtolower($row['gender'] ?? $row['Gender'] ?? ''),

            'zone'         => $row['zone'] ?? $row['Zone'] ?? null,

            // FIX: Force convert to string to avoid "must be a string" validation error on numbers
            'household_no' => (string) ($row['household_no'] ?? $row['Household No'] ?? null),
            'contact_no'   => (string) ($row['contact_no'] ?? $row['Contact No'] ?? null),

            'email'        => $row['email'] ?? $row['Email'] ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            '*.first_name'   => 'required|string|max:20',
            '*.last_name'    => 'required|string|max:20',
            '*.age'          => 'required|integer|min:1|max:120',
            '*.gender'       => 'required|in:male,female,Male,Female,MALE,FEMALE',
            '*.zone'         => 'required|string|max:20',

            // Relaxed rules: Accept integers but treat as required
            '*.household_no' => 'required',

            // FIX: Added 'unique' back so duplicates are caught as Validation Failures
            // instead of silent Database Errors.
            '*.contact_no'   => 'required|unique:residents,contact_no',
            '*.email'        => 'nullable|email|max:255|unique:residents,email',
        ];
    }
}
