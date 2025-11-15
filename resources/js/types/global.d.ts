import type { route as ziggyRoute } from 'ziggy-js';

declare global {
    // Make Laravel Ziggy's `route()` globally available
    const route: typeof ziggyRoute;

    interface Window {
        Echo: import('laravel-echo').default;
    }
}

export {};
