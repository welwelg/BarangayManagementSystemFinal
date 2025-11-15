import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Clock, Mail, MapPin, Megaphone, Phone, TriangleAlert, Users } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Navigation Header */}
                <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-lg">
                                    <img src="/brgylogo.png" alt="Barangay Logo" className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
                                        Barangay Management
                                    </h1>
                                    <p className="text-sm text-slate-500">System</p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden items-center space-x-8 md:flex">
                                <Link href="#about" className="font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    About
                                </Link>
                                <Link href="#services" className="font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Services
                                </Link>
                                <Link href="#contact" className="font-medium text-slate-600 transition-colors hover:text-blue-600">
                                    Contact
                                </Link>
                            </div>

                            {/* Auth Buttons */}
                            <div className="flex items-center space-x-3">
                                {auth.user ? (
                                    <Link href={route('dashboard')}>
                                        <Button variant="ghost" className="text-slate-600 hover:bg-blue-50 hover:text-blue-600">
                                            Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')}>
                                            <Button variant="ghost" className="text-slate-600 hover:bg-blue-50 hover:text-blue-600">
                                                Log in
                                            </Button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700">
                                                Register
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <h2 className="text-4xl leading-tight font-extrabold text-slate-800">
                                Empowering Communities with{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Smart Barangay Management
                                </span>
                            </h2>
                            <p className="text-lg text-slate-600">
                                A modern system to manage residents, announcements, and community activities with ease and efficiency.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl"
                                >
                                    Get Started
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-blue-200 bg-transparent transition-all duration-300 hover:border-blue-300 hover:bg-blue-50"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="relative">
                            <div className="relative z-10">
                                <Card className="hover:shadow-3xl border-0 bg-white/90 shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/30">
                                    <CardHeader className="rounded-t-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Users className="h-5 w-5" />
                                            <span>Barangay Dashboard</span>
                                        </CardTitle>
                                        <CardDescription className="text-blue-100">Real-time community management</CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4 p-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-lg bg-blue-50 p-3 text-center">
                                                <Users className="mx-auto mb-1 h-6 w-6 text-blue-600" />
                                                <p className="text-sm font-semibold text-blue-600">Residents</p>
                                                <p className="text-lg font-bold text-slate-800">1,247</p>
                                            </div>
                                            <div className="rounded-lg bg-emerald-50 p-3 text-center">
                                                <Megaphone className="mx-auto mb-1 h-6 w-6 text-emerald-600" />
                                                <p className="text-sm font-semibold text-emerald-600">Announcements</p>
                                                <p className="text-lg font-bold text-slate-800">15</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between rounded bg-slate-50 p-2">
                                                <span className="text-sm text-slate-600">Recent Activity</span>
                                                <Clock className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <div className="pl-2 text-xs text-slate-500">• New resident registered</div>
                                            <div className="pl-2 text-xs text-slate-500">• Community meeting scheduled</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Background Decorations */}
                            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 opacity-20 blur-xl"></div>
                            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 blur-xl"></div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <section id="services" className="bg-white/50 py-16 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-800">Our Services</h2>
                            <p className="text-lg text-slate-600">Comprehensive solutions for modern barangay management</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            <Card className="border border-slate-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <CardHeader>
                                    <div className="w-fit rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-3">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-slate-800">Resident Management</CardTitle>
                                    <CardDescription>Efficiently manage resident records, demographics, and community information.</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border border-slate-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <CardHeader>
                                    <div className="w-fit rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-3">
                                        <Megaphone className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-slate-800">Announcements</CardTitle>
                                    <CardDescription>Broadcast important news, events, and updates to your community members.</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border border-slate-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <CardHeader>
                                    <div className="w-fit rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 p-3">
                                        <TriangleAlert className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-slate-800">Disaster Reports</CardTitle>
                                    <CardDescription>
                                        Report, track, and monitor disasters in real-time to keep the community safe and informed.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-800">Contact Information</h2>
                            <p className="text-lg text-slate-600">Get in touch with your barangay office</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            <Card className="border border-slate-200/60 bg-white/80 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/30">
                                <CardContent className="p-6">
                                    <div className="mx-auto mb-4 w-fit rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 p-4">
                                        <Phone className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-800">Phone</h3>
                                    <p className="text-slate-600">+63 123 456 7890</p>
                                    <p className="text-slate-600">+63 987 654 3210</p>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/60 bg-white/80 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-400/30">
                                <CardContent className="p-6">
                                    <div className="mx-auto mb-4 w-fit rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-4">
                                        <Mail className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-800">Email</h3>
                                    <p className="text-slate-600">info@barangay.gov.ph</p>
                                    <p className="text-slate-600">captain@barangay.gov.ph</p>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/60 bg-white/80 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-400/30">
                                <CardContent className="p-6">
                                    <div className="mx-auto mb-4 w-fit rounded-full bg-gradient-to-br from-purple-500 to-violet-500 p-4">
                                        <MapPin className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-800">Address</h3>
                                    <p className="text-slate-600">123 Barangay Hall Street</p>
                                    <p className="text-slate-600">City, Province 1234</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                {/* Footer */}
                <footer className="mt-auto bg-slate-800 py-8 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between md:flex-row">
                            <div className="mb-4 flex items-center space-x-3 md:mb-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-indigo-400">
                                    <img src="/brgylogo.png" alt="Barangay Logo" className="h-full w-full object-cover" />
                                </div>
                                <span className="text-lg font-semibold">Barangay Management System</span>
                            </div>
                            <p className="text-sm text-slate-400">© 2025 Barangay Management System. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
