import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3Icon, PlusIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cookies } from "next/headers"
import { getCurrencySymbol } from "@/lib/utils"
import { AddTradeDialog } from "@/components/dialogs/add-trade-dialog"

export default async function TradingPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const { data: trades } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id)
        .order("trade_date", { ascending: false })

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    const currencySymbol = getCurrencySymbol(profile?.currency)

    const completedTrades = trades?.filter((trade) => trade.exit_price && trade.profit_loss) || []
    const totalPnL = completedTrades.reduce((sum, trade) => sum + Number(trade.profit_loss || 0), 0)
    const winningTrades = completedTrades.filter((trade) => Number(trade.profit_loss) > 0).length
    const totalTrades = completedTrades.length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    // Calendar Logic
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

    // Aggregate trades by day
    const dailyPnL: Record<number, { pnl: number, wins: number, losses: number }> = {}

    completedTrades.forEach(trade => {
        const date = new Date(trade.trade_date)
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const day = date.getDate()
            if (!dailyPnL[day]) dailyPnL[day] = { pnl: 0, wins: 0, losses: 0 }

            const pnl = Number(trade.profit_loss)
            dailyPnL[day].pnl += pnl
            if (pnl > 0) dailyPnL[day].wins++
            else dailyPnL[day].losses++
        }
    })

    // Monthly Stats
    const monthlyWins = Object.values(dailyPnL).reduce((acc, day) => acc + day.wins, 0)
    const monthlyLosses = Object.values(dailyPnL).reduce((acc, day) => acc + day.losses, 0)

    return (
        <MainLayout>
            <div className="space-y-6 animate-slide-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Trading Journal</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your trades and analyze performance
                        </p>
                    </div>
                    <AddTradeDialog />
                </div>


                <div className="grid gap-4 md:grid-cols-4">
                    <div className={`bento-card p-6 bg-white dark:bg-card border-l-4 ${totalPnL >= 0 ? "border-l-green-500" : "border-l-red-500"}`}>
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total P&L</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className={`text-3xl font-bold ${totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                                {totalPnL >= 0 ? "+" : ""}{currencySymbol}{totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                All time
                            </p>
                        </CardContent>
                    </div>

                    <div className="bento-card p-6 bg-white dark:bg-card">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Win Rate</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-3xl font-bold text-foreground">{winRate.toFixed(1)}%</div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {winningTrades}/{totalTrades} wins
                            </p>
                        </CardContent>
                    </div>

                    <div className="bento-card p-6 bg-white dark:bg-card">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Monthly W/L</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex items-end gap-2">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{monthlyWins}W</div>
                                <div className="text-2xl font-semibold text-muted-foreground mb-1">-</div>
                                <div className="text-3xl font-bold text-destructive">{monthlyLosses}L</div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {new Date().toLocaleString('default', { month: 'long' })} Performance
                            </p>
                        </CardContent>
                    </div>

                    <div className="bento-card p-6 bg-white dark:bg-card flex flex-col justify-center items-center text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Consistency Score</div>
                        <div className="text-4xl font-bold text-primary">
                            {totalTrades > 0 ? Math.min(100, Math.round((monthlyWins / (monthlyWins + monthlyLosses || 1)) * 80 + 20)) : 0}
                        </div>
                        <div className="w-full bg-secondary h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${totalTrades > 0 ? Math.min(100, Math.round((monthlyWins / (monthlyWins + monthlyLosses || 1)) * 80 + 20)) : 0}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="bento-card p-6 bg-white dark:bg-card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                        <div className="flex gap-2 text-xs">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-sm"></div> Win</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-sm"></div> Loss</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-muted-foreground">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {paddingDays.map((_, i) => (
                            <div key={`padding-${i}`} className="h-24 p-2 rounded-lg bg-secondary/5 border-transparent"></div>
                        ))}
                        {days.map((day) => {
                            const stats = dailyPnL[day]
                            const isProfitable = stats?.pnl > 0
                            const hasTrades = !!stats

                            return (
                                <div
                                    key={day}
                                    className={`h-24 p-2 rounded-lg border transition-all hover:scale-[1.02] flex flex-col justify-between
                                        ${!hasTrades ? "bg-secondary/5 border-transparent" : ""}
                                        ${hasTrades && isProfitable ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" : ""}
                                        ${hasTrades && !isProfitable ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800" : ""}
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-medium ${hasTrades ? "text-foreground" : "text-muted-foreground"}`}>{day}</span>
                                        {hasTrades && (
                                            <Badge variant={isProfitable ? "outline" : "destructive"} className={`text-[10px] px-1 h-5 ${isProfitable ? "text-green-700 border-green-200 bg-green-100 dark:bg-green-900 dark:text-green-300 dark:border-green-700" : ""}`}>
                                                {stats.wins}W {stats.losses}L
                                            </Badge>
                                        )}
                                    </div>
                                    {hasTrades && (
                                        <div className={`text-sm font-bold truncate ${isProfitable ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                                            {isProfitable ? "+" : ""}{currencySymbol}{stats.pnl.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {trades && trades.length > 0 ? (
                    <div className="bento-card p-0 bg-white dark:bg-card overflow-hidden">
                        <CardHeader className="p-6 border-b border-border/50">
                            <CardTitle className="text-lg font-semibold">Trade History</CardTitle>
                            <CardDescription>Your trading activity</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {trades.map((trade) => {
                                    const isProfitable = trade.profit_loss ? Number(trade.profit_loss) > 0 : null
                                    return (
                                        <div key={trade.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-lg text-foreground">{trade.symbol}</span>
                                                    <Badge variant={trade.type === "buy" ? "default" : "secondary"} className="capitalize rounded-md font-normal px-2">
                                                        {trade.type}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">
                                                        {Number(trade.quantity).toFixed(4)} @ {currencySymbol}{Number(trade.entry_price).toFixed(2)}
                                                    </span>
                                                </div>
                                                {trade.notes && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">{trade.notes}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {trade.profit_loss && (
                                                    <div className={`flex items-center justify-end gap-1 text-lg font-bold ${isProfitable ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                                                        {isProfitable ? <TrendingUpIcon className="h-4 w-4" /> : <TrendingDownIcon className="h-4 w-4" />}
                                                        {isProfitable ? "+" : ""}{currencySymbol}{Number(trade.profit_loss).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </div>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(trade.trade_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BarChart3Icon className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No trades yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start tracking your trades to analyze your trading performance
                            </p>
                            <AddTradeDialog />
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout >
    )
}
