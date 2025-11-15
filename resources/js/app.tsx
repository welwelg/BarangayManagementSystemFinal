import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';

import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

import './echo';

import { Toaster } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const pages = {
            ...import.meta.glob('./pages/**/*.tsx'),
            ...import.meta.glob('./pages/**/*.jsx'),
        } as Record<string, () => Promise<any>>;
        const importer = pages[`./pages/${name}.tsx`] || pages[`./pages/${name}.jsx`];
        if (!importer) {
            throw new Error(`Page not found: ${name}`);
        }
        const module = await importer();
        return module.default;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster 
                    position="top-right" 
                    richColors 
                    expand={true}
                    closeButton={true}
                    duration={5000}
                />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
