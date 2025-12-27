export default function AppLogo() {
    return (
        <>
            {/* 1. Logo Container - White Background Wrapper */}
            <div className="
                relative flex shrink-0 items-center justify-center
                transition-all duration-300 ease-in-out

                /* 🟢 ADDED: White Card Styling to match Login */
                bg-white
                rounded-lg
                shadow-sm
                p-1 /* Padding to prevent logo from touching edges */

                /* Base Size */
                size-10
                sm:size-11

                /* Sidebar States */
                group-data-[collapsible=icon]:size-8

                group-data-[state=expanded]:size-10
                sm:group-data-[state=expanded]:size-12

                group-data-[state=collapsed]:size-10
            ">
                <img
                    src="/barangayDemo.png"
                    alt="Barangay Logo"
                    className="
                        h-full w-full object-contain
                        transition-all duration-300 ease-in-out
                    "
                />
            </div>

            {/* 2. Text Container (Unchanged) */}
            <div className="
                grid flex-1 text-left leading-tight min-w-0
                transition-all duration-300 ease-in-out
                ml-2
                group-data-[collapsible=icon]:hidden
                group-data-[state=collapsed]:hidden
                group-data-[state=expanded]:space-y-0.5
                sm:group-data-[state=expanded]:space-y-1
            ">
                <span className="
                    truncate font-bold text-sidebar-foreground transition-all duration-300
                    text-base sm:text-lg
                    group-hover:text-blue-600 dark:group-hover:text-blue-400
                ">
                    Barangay Management
                </span>
                <span className="
                    truncate text-sidebar-foreground/80 transition-all duration-300
                    text-xs sm:text-sm
                    group-hover:text-sidebar-foreground/90
                ">
                    System
                </span>
            </div>
        </>
    );
}
