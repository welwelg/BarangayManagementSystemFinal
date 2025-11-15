import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
                <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800">
                    {/* Logo Section */}
                    <div className="mb-6 flex flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                            <img src="/brgylogo.png" alt="Barangay Logo" className="h-12 w-12 object-contain" />
                        </div>
                        <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">Barangay Management System</h2>
                        <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-300">Sign in to your account</p>
                    </div>

                    <form className="space-y-6" onSubmit={submit}>
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="name@gmail.com"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Your password
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

                        <div className="flex items-start">
                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        value=""
                                        className="h-4 w-4 rounded-sm border border-gray-300 bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        disabled={processing}
                                    />
                                </div>
                                <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
                                >
                                    Lost Password?
                                </TextLink>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Login to your account
                        </button>

                        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Not registered?{' '}
                            <TextLink href={route('register')} className="text-blue-700 hover:underline dark:text-blue-500">
                                Create account
                            </TextLink>
                        </div>
                    </form>

                    {status && <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>}
                </div>
            </div>
        </>
    );
}
