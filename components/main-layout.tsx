import { SidebarNav } from "@/components/sidebar-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthButton } from "@/components/auth-button"

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar is fixed on desktop, implemented in SidebarNav */}
            <SidebarNav />

            {/* Main Content Area - Pushed right on desktop */}
            <div className="flex-1 lg:pl-[19rem] lg:pr-6 lg:py-4 w-full">
                {/* Container for mobile/tablet responsive width */}
                <div className="min-h-[calc(100vh-2rem)] flex flex-col bg-transparent">

                    {/* Minimal Header - Removed "Finance Tracker" branding */}
                    <header className="sticky top-0 z-30 flex h-16 items-center justify-end px-4 lg:px-0 lg:mb-4 bg-background/80 backdrop-blur-sm lg:bg-transparent">
                        <div className="flex items-center gap-3">
                            <ModeToggle />
                            <AuthButton />
                        </div>
                    </header>

                    <main className="flex-1 p-4 lg:p-0 animate-slide-in">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
