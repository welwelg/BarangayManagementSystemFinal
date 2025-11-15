export default function AppLogo() {
    return (
        <>
            {/* Logo Container - Responsive sizing with smooth transitions */}
            <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-lg transition-all duration-300 ease-in-out group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg group-data-[state=expanded]:size-12 group-data-[state=collapsed]:size-10 hover:shadow-xl hover:scale-105">
                <img 
                    src="/brgylogo.png" 
                    alt="Barangay Logo" 
                    className="object-contain transition-all duration-300 ease-in-out group-data-[collapsible=icon]:size-5 group-data-[state=expanded]:size-8 group-data-[state=collapsed]:size-6 filter drop-shadow-sm"
                />
            </div>
            
            {/* Text Container - Responsive typography with smooth transitions */}
            <div className="ml-4 grid flex-1 text-left transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[state=collapsed]:hidden group-data-[state=expanded]:space-y-1 group-data-[state=collapsed]:space-y-0.5">
                <span className="truncate leading-tight font-bold text-sidebar-foreground transition-all duration-300 group-data-[state=expanded]:text-lg group-data-[state=collapsed]:text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Barangay Management
                </span>
                <span className="truncate text-sidebar-foreground/80 transition-all duration-300 group-data-[state=expanded]:text-sm group-data-[state=collapsed]:text-xs group-hover:text-sidebar-foreground/90">
                    System
                </span>
            </div>
        </>
    );
}
