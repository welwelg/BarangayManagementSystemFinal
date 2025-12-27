import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
                <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800">

                    {/* 🟢 UPDATED LOGO SECTION (COMPACT) 🟢 */}
                    <div className="mb-6 flex flex-col items-center">
                        {/* Wrapper: White background, rounded corners, shadow, compact padding */}
                        <div className="mb-4 flex items-center justify-center rounded-xl bg-white p-2 shadow-sm">
                            <img
                                src="/BarangayDemo.png"
                                alt="Barangay Logo"
                                // Image Size: h-20 (80px) to match login
                                className="h-20 w-auto object-contain"
                            />
                        </div>

                        <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">Barangay Management System</h2>
                        <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-300">Create your account</p>
                    </div>

                    <form className="space-y-6" onSubmit={submit}>
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Full name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Full Name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="name@email.com"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                name="password_confirmation"
                                id="password_confirmation"
                                placeholder="••••••••"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Create account
                        </button>

                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Already have an account?{' '}
                            <TextLink href={route('login')} className="text-blue-700 hover:underline dark:text-blue-500">
                                Log in
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
