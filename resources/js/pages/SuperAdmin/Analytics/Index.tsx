import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AnalyticsTrendChart } from '@/components/analytics-trend-chart';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Analytics', href: '/analytics' }];

// Define what the incoming data looks like for TypeScript
interface ChartData {
    month: string;
    count: number;
}

// Accept the props from Laravel
interface Props {
    blotterData: ChartData[];
    complaintData: ChartData[];
    disasterData: ChartData[];
}

export default function Index({ blotterData, complaintData, disasterData }: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                <div className="mb-4">
                   <h2 className="text-2xl font-bold tracking-tight">Barangay Analytics</h2>
                   <p className="text-muted-foreground">Real-time overview of cases and incidents.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                    {/* CARD 1: BLOTTERS */}
                    <AnalyticsTrendChart
                        title="Blotter Cases"
                        description="Last 6 Months Trend"
                        data={blotterData} // <--- Using Real Data
                        color="var(--chart-1)"
                    />

                    {/* CARD 2: COMPLAINTS */}
                    <AnalyticsTrendChart
                        title="Total Complaints"
                        description="Mediation Proceedings"
                        data={complaintData} // <--- Using Real Data
                        color="var(--chart-2)"
                    />

                    {/* CARD 3: DISASTER REPORTS */}
                    <AnalyticsTrendChart
                        title="Disaster Reports"
                        description="Recorded Incidents"
                        data={disasterData} // <--- Using Real Data
                        color="var(--chart-3)"
                    />

                </div>
            </div>
        </AppLayout>
    );
}
