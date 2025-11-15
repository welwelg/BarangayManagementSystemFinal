<?php
namespace App\Exports;

use App\Models\Admin\Resident;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ResidentsExport implements FromCollection, withHeadings, withMapping
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Resident::all();
    }

    public function headings(): array
    {
        return [
            'first_name',
            'middle_name',
            'last_name',
            'suffix',
            'age',
            'gender',
            'zone',
            'household_no',
            'contact_no',
            'email',
        ];
    }

    public function map($resident): array
    {
        return [

            $resident->first_name,
            $resident->middle_name,
            $resident->last_name,
            $resident->suffix,
            $resident->age,
            $resident->gender,
            $resident->zone,
            $resident->household_no,
            $resident->contact_no,
            $resident->email,

        ];
    }
}
