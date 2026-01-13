import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSignIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { cookies } from "next/headers"
import { getCurrencySymbol } from "@/lib/utils"

export default async function NetWorthPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const { data: assets } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", user.id)

    const { data: liabilities } = await supabase
        .from("liabilities")
        .select("*")
        .eq("user_id", user.id)

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    const currencySymbol = getCurrencySymbol(profile?.currency)

    const totalAssets = assets?.reduce((sum, asset) => sum + Number(asset.value), 0) || 0
    const totalLiabilities = liabilities?.reduce((sum, liability) => sum + Number(liability.amount), 0) || 0
    const netWorth = totalAssets - totalLiabilities

    return (
        <MainLayout>
            <div className="space-y-6 animate-slide-in">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Net Worth</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your overall financial health
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bento-card p-6 border-l-4 border-l-blue-500 bg-white dark:bg-card">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Assets</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-2xl font-bold text-foreground">
                                {currencySymbol}{totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                        </CardContent>
                    </div>

                    <div className="bento-card p-6 border-l-4 border-l-red-500 bg-white dark:bg-card">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Liabilities</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-2xl font-bold text-foreground">
                                {currencySymbol}{totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                        </CardContent>
                    </div>

                    <div className="bento-card p-6 border-l-4 border-l-green-500 bg-white dark:bg-card">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Net Worth</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className={`text-3xl font-bold ${netWorth >= 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                                {currencySymbol}{Math.abs(netWorth).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {netWorth >= 0 ? "Positive" : "Negative"} balance
                            </p>
                        </CardContent>
                    </div>
                </div>

                <div className="bento-card p-8 bg-white dark:bg-card">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle>Breakdown</CardTitle>
                        <CardDescription>Assets vs Liabilities</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Assets</span>
                                    <span className="text-sm font-semibold">{currencySymbol}{totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: totalAssets > 0 ? `${(totalAssets / (totalAssets + totalLiabilities)) * 100}%` : '0%' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Liabilities</span>
                                    <span className="text-sm font-semibold">{currencySymbol}{totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500"
                                        style={{ width: totalLiabilities > 0 ? `${(totalLiabilities / (totalAssets + totalLiabilities)) * 100}%` : '0%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </div>
        </MainLayout>
    )
}
