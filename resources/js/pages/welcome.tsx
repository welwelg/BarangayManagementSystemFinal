import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ChevronRight,
    CloudRain,
    Gavel,
    Megaphone,
    MessageSquare,
    Phone,
    ShieldAlert,
    Users,
    User,
    MapPin,
    Mail,
    Menu,
    X
} from 'lucide-react';

interface WelcomeProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function Welcome({ auth }: WelcomeProps) {
    // State for Mobile Navigation Toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Modern Barangay System" />

            <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
                {/* --- NAVIGATION --- */}
                <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg shadow-md shadow-blue-600/20">
                                <img src="/BarangayDemo.png" alt="Logo" className="h-full w-full object-cover opacity-90" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900">
                                    Barangay<span className="text-blue-700">Connect</span>
                                </h1>
                                <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">Management Portal</p>
                            </div>
                        </div>

                        {/* Desktop Menu (Hidden on Mobile) */}
                        <div className="hidden items-center gap-8 md:flex">
                            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">Features</a>
                            <a href="#officials" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">Officials</a>
                            <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">Contact</a>
                        </div>

                        {/* Desktop Auth Buttons (Hidden on Mobile) */}
                        <div className="hidden items-center gap-2 md:flex">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button className="bg-slate-900 text-white hover:bg-slate-800">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="ghost" className="text-slate-600 hover:bg-slate-100">Log in</Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-700/20">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <div className="flex items-center md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-slate-600"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="border-t border-slate-100 bg-white px-4 py-6 shadow-lg md:hidden">
                            <div className="flex flex-col space-y-4">
                                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-blue-700">Features</a>
                                <a href="#officials" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-blue-700">Officials</a>
                                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-blue-700">Contact</a>
                                <div className="h-px w-full bg-slate-100 my-2"></div>
                                {auth.user ? (
                                    <Link href={route('dashboard')} onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link href={route('login')} onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full justify-center text-slate-600">Log in</Button>
                                        </Link>
                                        <Link href={route('register')} onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-700/20">Get Started</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                {/* --- HERO SECTION --- */}
                <section className="relative overflow-hidden pt-12 pb-16 lg:pt-32 lg:pb-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                            {/* Hero Content */}
                            <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 mb-6">
                                    <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                    System Live Status: Normal
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6">
                                    Empowering the <br />
                                    <span className="text-blue-700">Local Community</span>
                                </h1>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                    A centralized platform for residents and officials. Report incidents, request documents, and stay updated with typhoon alerts in real-time.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Button size="lg" className="h-12 px-8 bg-blue-700 hover:bg-blue-800 text-base shadow-xl shadow-blue-700/20 w-full sm:w-auto">
                                        Access Services <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Hero Visual Mockup */}
                            <div className="relative mx-auto w-full max-w-md lg:max-w-none mt-8 lg:mt-0">
                                <div className="relative z-10 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/50">
                                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="space-y-1">
                                                <div className="h-2 w-24 bg-slate-200 rounded"></div>
                                                <div className="h-4 w-40 bg-slate-900 rounded"></div>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Activity className="h-4 w-4 text-blue-700"/>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                                            <div className="rounded-lg bg-blue-600 p-2 sm:p-3 text-white">
                                                <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-2 opacity-80"/>
                                                <div className="h-3 sm:h-4 w-8 bg-white/30 rounded mb-1"></div>
                                                <div className="text-[10px] sm:text-xs opacity-80">Residents</div>
                                            </div>
                                            <div className="rounded-lg bg-white border border-slate-200 p-2 sm:p-3">
                                                <Gavel className="h-4 w-4 sm:h-5 sm:w-5 mb-2 text-slate-400"/>
                                                <div className="h-3 sm:h-4 w-8 bg-slate-100 rounded mb-1"></div>
                                                <div className="text-[10px] sm:text-xs text-slate-500">Blotters</div>
                                            </div>
                                            <div className="rounded-lg bg-white border border-slate-200 p-2 sm:p-3">
                                                <CloudRain className="h-4 w-4 sm:h-5 sm:w-5 mb-2 text-slate-400"/>
                                                <div className="h-3 sm:h-4 w-8 bg-slate-100 rounded mb-1"></div>
                                                <div className="text-[10px] sm:text-xs text-slate-500">Weather</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FEATURES SECTION --- */}
                <section id="features" className="py-16 lg:py-24 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Digital Barangay Services</h2>
                            <p className="mt-4 text-lg text-slate-600">Efficient, transparent, and accessible public service.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="col-span-1 sm:col-span-2 lg:col-span-2 border-slate-100 bg-slate-50 hover:border-blue-200 transition-all duration-300">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center mb-3">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <CardTitle>Resident Management</CardTitle>
                                </CardHeader>
                                <CardContent><p className="text-slate-600">Digital census and profiling.</p></CardContent>
                            </Card>
                            <Card className="col-span-1 border-slate-100 hover:border-orange-200 transition-all duration-300">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center mb-3">
                                        <ShieldAlert className="h-5 w-5 text-white" />
                                    </div>
                                    <CardTitle>Disaster Reports</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card className="col-span-1 border-slate-100 hover:border-sky-300 transition-all duration-300">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center mb-3">
                                        <CloudRain className="h-5 w-5 text-white" />
                                    </div>
                                    <CardTitle>Typhoon Watch</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card className="col-span-1 sm:col-span-2 lg:col-span-2 border-slate-100 hover:border-purple-200 transition-all duration-300">
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                                        <Gavel className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle>E-Blotter & Hearings</CardTitle>
                                        <p className="text-sm text-slate-500 mt-1">Automated scheduling.</p>
                                    </div>
                                </CardHeader>
                            </Card>
                            <Card className="col-span-1 border-slate-100 hover:border-emerald-200 transition-all duration-300">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center mb-3">
                                        <Megaphone className="h-5 w-5 text-white" />
                                    </div>
                                    <CardTitle>Announcements</CardTitle>
                                </CardHeader>
                            </Card>
                            <Card className="col-span-1 border-slate-100 hover:border-indigo-200 transition-all duration-300">
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mb-3">
                                        <MessageSquare className="h-5 w-5 text-white" />
                                    </div>
                                    <CardTitle>Direct Message</CardTitle>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* --- OFFICIALS SECTION --- */}
                <section id="officials" className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 lg:mb-20">
                            <h2 className="text-3xl font-bold text-slate-900">Our Public Servants</h2>
                            <p className="mt-2 text-slate-600">Meet the dedicated leaders of our community</p>
                        </div>

                        {/* --- PART 1: SANGGUNIANG BARANGAY --- */}
                        <div className="mb-20 lg:mb-24">
                            <div className="flex items-center justify-center gap-4 mb-10">
                                <div className="h-px w-8 sm:w-12 bg-slate-300"></div>
                                <h3 className="text-lg sm:text-xl font-bold tracking-widest uppercase text-blue-800 text-center">Sangguniang Barangay</h3>
                                <div className="h-px w-8 sm:w-12 bg-slate-300"></div>
                            </div>

                            {/* Captain */}
                            <div className="flex justify-center mb-10">
                                <div className="group relative w-full max-w-xs sm:max-w-sm overflow-hidden rounded-2xl bg-white p-5 shadow-lg border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 mb-6 relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                            <User className="h-24 w-24 sm:h-32 sm:w-32" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
                                            Punong Barangay
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900">Hon. Juan Dela Cruz</h4>
                                        <p className="mt-2 text-sm text-slate-500 italic">"Leading with integrity and service."</p>
                                    </div>
                                </div>
                            </div>

                            {/* Kagawads & Admin Grid */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:gap-8">
                                {[
                                    "Committee on Peace & Order",
                                    "Committee on Health",
                                    "Committee on Education",
                                    "Committee on Infrastructure",
                                    "Committee on Environment",
                                    "Committee on Finance",
                                    "Barangay Secretary",
                                    "Barangay Treasurer"
                                ].map((role, i) => (
                                    <div key={i} className="rounded-xl bg-white p-3 sm:p-4 shadow-sm border border-slate-100 text-center transition-all hover:shadow-md">
                                        <div className="mx-auto mb-3 h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-full bg-slate-100 border-2 border-white shadow-sm">
                                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                <User className="h-6 w-6 sm:h-8 sm:w-8" />
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-slate-900 text-xs sm:text-sm">Hon. Official Name</h5>
                                        <p className="text-[10px] sm:text-xs text-blue-600 font-medium mt-1 leading-tight">{role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- PART 2: SANGGUNIANG KABATAAN --- */}
                        <div>
                            <div className="flex items-center justify-center gap-4 mb-10">
                                <div className="h-px w-8 sm:w-12 bg-slate-300"></div>
                                <h3 className="text-lg sm:text-xl font-bold tracking-widest uppercase text-teal-700 text-center">Sangguniang Kabataan</h3>
                                <div className="h-px w-8 sm:w-12 bg-slate-300"></div>
                            </div>

                            {/* SK Chairperson */}
                            <div className="flex justify-center mb-10">
                                <div className="group relative w-full max-w-xs sm:max-w-sm overflow-hidden rounded-2xl bg-white p-5 shadow-lg border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 mb-6 relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                            <User className="h-24 w-24 sm:h-32 sm:w-32" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 mb-2">
                                            SK Chairperson
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900">Hon. Maria Clara</h4>
                                        <p className="mt-2 text-sm text-slate-500 italic">"Empowering the youth for a better future."</p>
                                    </div>
                                </div>
                            </div>

                            {/* SK Kagawads Grid */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:gap-8">
                                {[
                                    "Committee on Sports",
                                    "Committee on Culture",
                                    "Committee on Anti-Drug",
                                    "Committee on Environment",
                                    "Committee on Gender Dev",
                                    "SK Secretary",
                                    "SK Treasurer"
                                ].map((role, i) => (
                                    <div key={i} className="rounded-xl bg-white p-3 sm:p-4 shadow-sm border border-slate-100 text-center transition-all hover:shadow-md">
                                        <div className="mx-auto mb-3 h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-full bg-slate-100 border-2 border-white shadow-sm">
                                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                <User className="h-6 w-6 sm:h-8 sm:w-8" />
                                            </div>
                                        </div>
                                        <h5 className="font-semibold text-slate-900 text-xs sm:text-sm">Hon. Youth Leader</h5>
                                        <p className="text-[10px] sm:text-xs text-teal-600 font-medium mt-1 leading-tight">{role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <section id="contact" className="bg-slate-900 py-12 lg:py-16 text-slate-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 md:grid-cols-2">
                            <div>
                                <h3 className="mb-6 text-2xl font-bold text-white">Contact Us</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                                        <p className="text-sm">(02) 8123-4567</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                                        <p className="text-sm">123 Gov. St, City, Philippines</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                                        <p className="text-sm">helpdesk@brgy.gov.ph</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li><a href="#" className="hover:text-blue-400">Services</a></li>
                                            <li><a href="#" className="hover:text-blue-400">Ordinances</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="mb-4 font-semibold text-white">Legal</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li><a href="#" className="hover:text-blue-400">Privacy</a></li>
                                            <li><a href="#" className="hover:text-blue-400">Terms</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-8 text-sm text-slate-500">© 2026 Barangay Management System.</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
