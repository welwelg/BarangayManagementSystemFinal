import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ModeToggle() {
    // 1. Initialize state based on localStorage or system preference
    const [theme, setTheme] = useState<string>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) return storedTheme;

            // Check system preference if no local storage found
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    // 2. Apply the theme class to the HTML document
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove both to prevent conflicts
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Save to local storage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            title="Toggle Dark/Light Mode"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 transition-all" />
            ) : (
                <Moon className="h-5 w-5 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
