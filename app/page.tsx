import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletIcon, CreditCardIcon, DollarSignIcon, TrendingDownIcon, TrendingUpIcon, ArrowRightIcon, ShoppingCartIcon, BarChart3Icon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"
import { getCurrencySymbol } from "@/lib/utils"
import { getExchangeRate } from "@/lib/currency"

// Main Entry Point
export default async function Page() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    return <Dashboard user={user} />
}

// Authenticated Dashboard Component
async function Dashboard({ user }: { user: any }) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Fetch user's financial data
    const { data: assets } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", user.id)

    const { data: liabilities } = await supabase
        .from("liabilities")
        .select("*")
        .eq("user_id", user.id)

    const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0])

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    const currencySymbol = getCurrencySymbol(profile?.currency)

    const totalAssets = assets?.reduce((sum, asset) => sum + Number(asset.value), 0) || 0
    const totalLiabilities = liabilities?.reduce((sum, liability) => sum + Number(liability.amount), 0) || 0
    const netWorth = totalAssets - totalLiabilities
    const monthlyExpenses = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0

    const recentExpenses = expenses?.slice(0, 5) || []

    // Dynamic Net Worth Status Logic
    const userCurrency = profile?.currency || 'USD'
    // If user currency is not USD, fetch rate. 
    // If rate fails (returns 0), fallback to 1 but that might be misleading if values are huge. 
    // Assuming 1 for fallback is safer than crashing, or we can just treat it as raw value.
    const rateToUSD = userCurrency === 'USD' ? 1 : await getExchangeRate(userCurrency, 'USD')
    const netWorthUSD = netWorth * (rateToUSD || 0) // Handle potential 0 rate by making USD 0 so it shows 'Low' perhaps? Or just use raw check. Let's use 0 to prompt attention.

    let statusLabel = "Healthy"
    let statusColorClass = "text-emerald-600 dark:text-emerald-400"
    let statusBgClass = "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
    let StatusIcon = TrendingUpIcon

    if (netWorthUSD < 30) {
        statusLabel = "Low"
        statusColorClass = "text-destructive"
        statusBgClass = "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        StatusIcon = TrendingDownIcon
    } else if (netWorthUSD >= 30 && netWorthUSD < 100) {
        statusLabel = "Moderate"
        statusColorClass = "text-yellow-600 dark:text-yellow-400"
        statusBgClass = "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        StatusIcon = TrendingUpIcon
    }

    return (
        <MainLayout>
            <div className="space-y-8 animate-slide-in">
                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground/90">
                            Casa
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Welcome back, <span className="text-foreground font-medium">{profile?.full_name?.split(' ')[0] || 'friend'}</span>.
                        </p>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Bento Grid Summary */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bento-card p-6 bg-white dark:bg-card">
                        <div className="flex flex-row items-center justify-between pb-4">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Net Worth</span>
                            <div className={`p-2 rounded-full ${statusBgClass}`}>
                                <DollarSignIcon className="size-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold tracking-tight text-foreground">
                                {currencySymbol}{Math.abs(netWorth).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-medium">
                            <span className={`${statusColorClass} flex items-center gap-1`}>
                                <StatusIcon className="size-3" /> {statusLabel}
                            </span>
                        </div>
                    </div>

                    <div className="bento-card p-6 bg-white dark:bg-card">
                        <div className="flex flex-row items-center justify-between pb-4">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Assets</span>
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <WalletIcon className="size-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {currencySymbol}{totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Across {assets?.length || 0} accounts
                        </p>
                    </div>

                    <div className="bento-card p-6 bg-white dark:bg-card">
                        <div className="flex flex-row items-center justify-between pb-4">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Liabilities</span>
                            <div className="p-2 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                <CreditCardIcon className="size-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {currencySymbol}{totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {liabilities?.length || 0} active debts
                        </p>
                    </div>

                    <div className="bento-card p-6 bg-white dark:bg-card">
                        <div className="flex flex-row items-center justify-between pb-4">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Spending</span>
                            <div className="p-2 rounded-full bg-primary/20 text-primary">
                                <TrendingDownIcon className="size-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {currencySymbol}{monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            This month
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-3 h-full">
                    {/* Recent Expenses List - Spans 2 cols */}
                    <div className="md:col-span-2 bento-card p-0 overflow-hidden bg-white dark:bg-card flex flex-col">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">Recent Activity</h3>
                                <p className="text-sm text-muted-foreground">Your latest transactions</p>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-primary/10">
                                <Link href="/expenses">
                                    View All <ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="p-2">
                            {recentExpenses.length > 0 ? (
                                <div className="space-y-1">
                                    {recentExpenses.map((expense) => (
                                        <div key={expense.id} className="flex items-center justify-between p-4 hover:bg-secondary/50 rounded-xl transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-white group-hover:shadow-sm transition-all text-sm">
                                                    {expense.category.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground">{expense.description}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{expense.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-foreground">
                                                    -{currencySymbol}{Number(expense.amount).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="size-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                                        <ShoppingCartIcon className="size-6 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">No recent activity found.</p>
                                    <Button variant="link" size="sm" asChild className="mt-2 text-primary">
                                        <Link href="/expenses">Log an expense</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions / Side Panel */}
                    <div className="bento-card p-6 bg-slate-50 dark:bg-secondary/10 border-0">
                        <h3 className="font-semibold mb-4 text-foreground/80">Quick Actions</h3>
                        <div className="grid gap-3">
                            <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-border/60 bg-white dark:bg-card hover:border-primary/50 hover:text-primary transition-all shadow-sm" asChild>
                                <Link href="/expenses">
                                    <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md mr-3">
                                        <TrendingDownIcon className="size-4" />
                                    </div>
                                    Add Expense
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-border/60 bg-white dark:bg-card hover:border-primary/50 hover:text-primary transition-all shadow-sm" asChild>
                                <Link href="/assets">
                                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md mr-3">
                                        <WalletIcon className="size-4" />
                                    </div>
                                    Add Asset
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-border/60 bg-white dark:bg-card hover:border-primary/50 hover:text-primary transition-all shadow-sm" asChild>
                                <Link href="/trading">
                                    <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md mr-3">
                                        <BarChart3Icon className="size-4" />
                                    </div>
                                    Log Trade
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-8">
                            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Market Status</h3>
                            <MarketStatus />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

function MarketStatus() {
    const today = new Date()
    const day = today.getDay()
    const isWeekend = day === 0 || day === 6
    // Simple 9-5 check for now, can be expanded to real market hours
    const hour = today.getHours()
    const isWorkingHours = hour >= 9 && hour < 17

    // Determine status
    // Market is Open if it's a Weekday AND (optional: working hours, but prompt said "open during weekdays")
    // Prompt said "close during weekends", implying open all weekday? 
    // I'll stick to a simple Weekday = Open, Weekend = Closed for simplicity as requested, 
    // maybe adding a small "Closed" if it's weekday but late night could be confusing if not asked.
    // Let's stick to Weekday vs Weekend.

    const isOpen = !isWeekend

    if (isOpen) {
        return (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                <div className="flex items-center gap-2 mb-1">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-green-700 dark:text-green-400">Market Open</span>
                </div>
                <p className="text-xs text-green-600/80 dark:text-green-400/80">
                    Standard trading session active.
                </p>
            </div>
        )
    }

    return (
        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
            <div className="flex items-center gap-2 mb-1">
                <div className="size-2 rounded-full bg-orange-500"></div>
                <span className="text-xs font-bold text-orange-700 dark:text-orange-400">Market Closed</span>
            </div>
            <p className="text-xs text-orange-600/80 dark:text-orange-400/80">
                Markets are currently closed.
            </p>
        </div>
    )
}

