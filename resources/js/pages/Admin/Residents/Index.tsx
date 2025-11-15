import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download, Edit, Mail, MapPin, Phone, Search, Trash2, Upload, UserPlus, Users } from 'lucide-react';
import { useRef, useState } from 'react';
import { MdManageAccounts } from 'react-icons/md';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Residents',
        href: '/admin/residents',
    },
];

interface Resident {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    age: number;
    gender: string;
    zone: string;
    household_no: string;
    contact_no: string;
    email: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps extends InertiaPageProps {
    residents: {
        data: Resident[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    flash?: {
        message?: string;
    };
}

export default function Index() {
    const { residents, flash } = usePage<PageProps>().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGender, setSelectedGender] = useState('all');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleExport = () => {
        window.location.href = route('admin.residents.export');
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        router.post(route('admin.residents.import'), formData, {
            onSuccess: () => alert('✅ Import successful!'),
            onError: () => alert('❌ Import failed. Please check the file format.'),
        });
    };

    const getGenderBadge = (gender: string) => {
        return gender.toLowerCase() === 'male' ? (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Male
            </span>
        ) : (
            <span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                Female
            </span>
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this resident?')) {
            router.delete(route('admin.residents.destroy', id));
        }
    };

    const filteredResidents = residents.data.filter((resident) => {
        const matchesSearch =
            resident.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (resident.middle_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (resident.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.contact_no.includes(searchQuery);

        const matchesGender = selectedGender === 'all' || resident.gender.toLowerCase() === selectedGender;

        return matchesSearch && matchesGender;
    });

    const totalMale = residents.data.filter((r) => r.gender.toLowerCase() === 'male').length;
    const totalFemale = residents.data.filter((r) => r.gender.toLowerCase() === 'female').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Residents" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                {/* Flash Message */}
                {flash?.message && (
                    <div className="mx-4 mt-4 rounded-md bg-green-50 p-4 sm:mx-6 dark:bg-green-900/50">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">{flash.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="border-b border-slate-200/60 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6 dark:border-gray-700 dark:bg-gray-800/80">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-2 shadow-md">
                                <Users className="h-5 w-6 text-white sm:h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800 sm:text-2xl dark:text-slate-200">Residents</h1>
                            </div>
                        </div>
                        <Link href={route('admin.residents.create')}>
                            <button className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Resident
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-4 sm:p-6">
                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 lg:grid-cols-3">
                        <div className="rounded-lg border border-blue-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:p-4 dark:border-gray-700/60 dark:bg-gray-800/80">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 p-2 sm:p-3">
                                    <Users className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-blue-600 sm:text-2xl dark:text-blue-400">{residents.total}</p>
                                    <p className="text-xs font-medium text-slate-500 sm:text-sm dark:text-gray-400">Total Residents</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-pink-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:p-4 dark:border-gray-700/60 dark:bg-gray-800/80">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 p-2 sm:p-3">
                                    <Users className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-pink-600 sm:text-2xl dark:text-pink-400">{totalFemale}</p>
                                    <p className="text-xs font-medium text-slate-500 sm:text-sm dark:text-gray-400">Female</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl sm:p-4 dark:border-gray-700/60 dark:bg-gray-800/80">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2 sm:p-3">
                                    <Users className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-blue-600 sm:text-2xl dark:text-blue-400">{totalMale}</p>
                                    <p className="text-xs font-medium text-slate-500 sm:text-sm dark:text-gray-400">Male</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="mb-6 rounded-lg border border-slate-200/60 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/80">
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Residents Management</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Manage and track all barangay residents</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import
                                </button>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    title="Import residents file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleImport}
                                />
                                <button
                                    onClick={handleExport}
                                    className="inline-flex items-center rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400 dark:text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search residents by name, email, or contact..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-md border border-slate-200 bg-white/80 py-2 pr-4 pl-10 text-sm backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700/80 dark:text-white"
                                    />
                                </div>
                            </div>
                            <select
                                title="Filter by gender"
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                                className="w-full rounded-md border border-slate-200 bg-white/80 px-3 py-2 text-sm backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-[180px] dark:border-gray-600 dark:bg-gray-700/80 dark:text-white"
                            >
                                <option value="all">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Residents Table */}
                    <div className="rounded-lg border border-slate-200/60 bg-white/80 shadow-lg backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800/80">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-gray-400">
                                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 text-xs text-slate-700 uppercase dark:from-gray-700 dark:to-gray-600 dark:text-gray-300">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold sm:px-6">Name</th>
                                        <th className="hidden px-4 py-3 font-semibold sm:px-6 md:table-cell">Age</th>
                                        <th className="px-4 py-3 font-semibold sm:px-6">Gender</th>
                                        <th className="hidden px-4 py-3 font-semibold sm:px-6 lg:table-cell">Zone</th>
                                        <th className="hidden px-4 py-3 font-semibold sm:px-6 xl:table-cell">Household</th>
                                        <th className="hidden px-4 py-3 font-semibold sm:table-cell sm:px-6">Contact</th>
                                        <th className="hidden px-4 py-3 font-semibold sm:px-6 lg:table-cell">Email</th>
                                        <th className="px-4 py-3 font-semibold sm:px-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResidents.length > 0 ? (
                                        filteredResidents.map((resident) => (
                                            <tr
                                                key={resident.id}
                                                className="border-b border-slate-200 transition-colors hover:bg-slate-50/50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                            >
                                                <td className="px-4 py-4 sm:px-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex aspect-square h-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white ring-2 ring-blue-200 dark:ring-blue-700">
                                                            <span className="leading-none">
                                                                {resident.first_name?.charAt(0).toUpperCase()}
                                                                {resident.last_name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-800 dark:text-slate-200">
                                                                {resident.first_name} {resident.middle_name || ''} {resident.last_name}{' '}
                                                                {resident.suffix || ''}
                                                            </p>
                                                            <p className="text-xs text-slate-500 md:hidden dark:text-slate-400">
                                                                Age {resident.age} • {resident.zone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden px-4 py-4 sm:px-6 md:table-cell">{resident.age}</td>
                                                <td className="px-4 py-4 sm:px-6">{getGenderBadge(resident.gender)}</td>
                                                <td className="hidden px-4 py-4 sm:px-6 lg:table-cell">
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="h-4 w-4 text-slate-400" />
                                                        <span>{resident.zone}</span>
                                                    </div>
                                                </td>
                                                <td className="hidden px-4 py-4 sm:px-6 xl:table-cell">#{resident.household_no}</td>
                                                <td className="hidden px-4 py-4 sm:table-cell sm:px-6">
                                                    <div className="flex items-center space-x-1">
                                                        <Phone className="h-4 w-4 text-slate-400" />
                                                        <span>{resident.contact_no}</span>
                                                    </div>
                                                </td>
                                                <td className="hidden px-4 py-4 sm:px-6 lg:table-cell">
                                                    <div className="flex items-center space-x-1">
                                                        <Mail className="h-4 w-4 text-slate-400" />
                                                        <span className="max-w-[150px] truncate">{resident.email || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 sm:px-6">
                                                    <div className="flex gap-2">
                                                        <Link href={route('admin.residents.edit', resident.id)}>
                                                            <button className="inline-flex items-center rounded-md border border-slate-200 bg-transparent px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                                                                <Edit className="h-3 w-3 sm:mr-1 sm:h-4 sm:w-4" />
                                                                <span className="hidden sm:inline">Edit</span>
                                                            </button>
                                                        </Link>

                                                        <Link href={route('users.create', { resident: resident.id })}>
                                                            <button className="inline-flex items-center rounded-md border border-blue-500 bg-blue-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-600 sm:text-sm dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                                                <MdManageAccounts className="h-3 w-3 sm:mr-1 sm:h-4 sm:w-4" />
                                                                <span className="hidden sm:inline">Register</span>
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(resident.id)}
                                                            className="inline-flex items-center rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-600"
                                                        >
                                                            <Trash2 className="h-3 w-3 sm:mr-1 sm:h-4 sm:w-4" />
                                                            <span className="hidden sm:inline">Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center">
                                                <Users className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-gray-500" />
                                                <h3 className="mb-2 text-lg font-semibold text-slate-600 dark:text-slate-400">No residents found</h3>
                                                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {residents.links && residents.links.length > 3 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:px-6 dark:border-gray-700">
                                <div className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                                    Showing page {residents.current_page} of {residents.last_page}
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {residents.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`inline-flex items-center rounded-md px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                                                link.active
                                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                                    : link.url
                                                      ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700'
                                                      : 'cursor-not-allowed border border-slate-200 bg-white text-slate-400 opacity-50 dark:border-slate-600 dark:bg-gray-800'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
