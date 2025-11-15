import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { IoIosPeople } from 'react-icons/io';

const breadcrumbs = [
    {
        title: 'Add Resident',
        href: '/admin/residents/create',
    },
];

export default function Create() {
    const { flash } = usePage().props;

    // --- Inertia useForm state ---
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        age: '',
        gender: '',
        zone: '',
        household_no: '',
        contact_no: '',
        email: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.residents.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Resident" />

            <div className="p-4 md:p-6">
                <Card>
                    <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
                        <IoIosPeople className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">Add Residents</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 p-4 md:p-6">
                            {/* Name Fields - Two Column Layout */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        type="text"
                                        placeholder="Input First Name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        required
                                    />
                                    {errors.first_name && <span className="text-sm text-red-500">{errors.first_name}</span>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="middle_name">Middle Name</Label>
                                    <Input
                                        id="middle_name"
                                        type="text"
                                        placeholder="Input Middle Name (Optional)"
                                        value={data.middle_name}
                                        onChange={(e) => setData('middle_name', e.target.value)}
                                    />
                                    {errors.middle_name && <span className="text-sm text-red-500">{errors.middle_name}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        type="text"
                                        placeholder="Input Last Name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        required
                                    />
                                    {errors.last_name && <span className="text-sm text-red-500">{errors.last_name}</span>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="suffix">Suffix</Label>
                                    <Select value={data.suffix} onValueChange={(value) => setData('suffix', value)}>
                                        <SelectTrigger id="suffix">
                                            <SelectValue placeholder="Select Suffix (Optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NA">N/A</SelectItem>
                                            <SelectItem value="Jr">Jr</SelectItem>
                                            <SelectItem value="Sr">Sr</SelectItem>
                                            <SelectItem value="III">III</SelectItem>
                                            <SelectItem value="IV">IV</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.suffix && <span className="text-sm text-red-500">{errors.suffix}</span>}
                                </div>
                            </div>

                            {/* Age and Gender - Two Column Layout */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="Enter age (e.g., 30)"
                                        value={data.age}
                                        onChange={(e) => setData('age', e.target.value)}
                                        required
                                        min="1"
                                        max="120"
                                    />
                                    {errors.age && <span className="text-sm text-red-500">{errors.age}</span>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <span className="text-sm text-red-500">{errors.gender}</span>}
                                </div>
                            </div>

                            {/* Zone and Household - Two Column Layout */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="zone">Zone</Label>
                                    <Input
                                        id="zone"
                                        type="text"
                                        placeholder="Enter zone (e.g., Zone 1)"
                                        value={data.zone}
                                        onChange={(e) => setData('zone', e.target.value)}
                                        required
                                    />
                                    {errors.zone && <span className="text-sm text-red-500">{errors.zone}</span>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="household_no">Household Number</Label>
                                    <Input
                                        id="household_no"
                                        type="text"
                                        placeholder="Enter household number (e.g., 123)"
                                        value={data.household_no}
                                        onChange={(e) => setData('household_no', e.target.value)}
                                        required
                                    />
                                    {errors.household_no && <span className="text-sm text-red-500">{errors.household_no}</span>}
                                </div>
                            </div>

                            {/* Contact and Email - Two Column Layout */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="contact_no">Contact Number</Label>
                                    <Input
                                        id="contact_no"
                                        type="tel"
                                        placeholder="09123456789"
                                        value={data.contact_no}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            setData('contact_no', value);
                                        }}
                                        required
                                        pattern="^09\d{9}$"
                                        maxLength={11}
                                    />
                                    {errors.contact_no && <span className="text-sm text-red-500">{errors.contact_no}</span>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@example.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="p-4 md:p-6">
                            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        'Save Resident'
                                    )}
                                </Button>
                                <Link href={route('admin.residents.index')}>
                                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
