"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    HomeIcon, // Replaced LayoutDashboard for "Casa"
    WalletIcon,
    CreditCardIcon,
    ShoppingCartIcon,
    TrendingUpIcon,
    BarChart3Icon,
    DollarSignIcon,
    SettingsIcon,
} from "lucide-react"

const navItems = [
    {
        title: "Casa", // Renamed from Dashboard
        href: "/",
        icon: HomeIcon,
    },
    {
        title: "Assets",
        href: "/assets",
        icon: WalletIcon,
    },
    {
        title: "Liabilities",
        href: "/liabilities",
        icon: CreditCardIcon,
    },
    {
        title: "Expenses",
        href: "/expenses",
        icon: ShoppingCartIcon,
    },
    {
        title: "Investments",
        href: "/investments",
        icon: TrendingUpIcon,
    },
    {
        title: "Trading",
        href: "/trading",
        icon: BarChart3Icon,
    },
    {
        title: "Net Worth",
        href: "/net-worth",
        icon: DollarSignIcon,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: SettingsIcon,
    },
]

export function SidebarNav() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-4 top-4 bottom-4 z-40 w-64 hidden lg:flex flex-col gap-4">
            {/* Floating Sidebar Container - Bento Style */}
            <div className="flex-1 flex flex-col bg-sidebar border border-sidebar-border rounded-xl shadow-sm p-4">
                <div className="mb-8 flex items-center px-2">
                    <div className="text-4xl font-bold text-primary mr-2 tracking-tighter">
                        R
                    </div>
                    <span className="text-xl font-bold tracking-tight text-sidebar-foreground">Ravenna</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/" && pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm" // Soft accent active state
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                )}
                            >
                                <Icon className={cn("size-5", isActive && "text-primary")} />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>

                {/* Optional footer area in sidebar */}
                <div className="mt-auto px-2 py-4 border-t border-sidebar-border/50">
                    <p className="text-xs text-sidebar-foreground/50 text-center">Ravenna v1.0</p>
                </div>
            </div>
        </aside>
    )
}
