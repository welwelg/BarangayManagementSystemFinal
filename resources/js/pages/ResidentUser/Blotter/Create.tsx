import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head} from '@inertiajs/react';



const breadcrumbs: BreadcrumbItem[] = [{ title: 'Blotter', href: '/user/blotter/create' }];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blotter" />
            <div className="relative m-4 overflow-x-auto shadow-md sm:rounded-lg">
               <h1 className="text-2xl font-bold">Request Blotter Form</h1>
            </div>
        </AppLayout>
    );
}
