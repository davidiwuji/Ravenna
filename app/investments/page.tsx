import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, TrendingUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"
import { getCurrencySymbol } from "@/lib/utils"
import { AddInvestmentDialog } from "@/components/dialogs/add-investment-dialog"

export default async function InvestmentsPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const { data: investments } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "investment")
        .order("created_at", { ascending: false })

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    const currencySymbol = getCurrencySymbol(profile?.currency)

    const totalInvestments = investments?.reduce((sum, inv) => sum + Number(inv.value), 0) || 0

    return (
        <MainLayout>
            <div className="space-y-6 animate-slide-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Investments</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your investment portfolio
                        </p>
                    </div>
                    <AddInvestmentDialog />
                </div>


                <div className="bento-card p-6 border-l-4 border-l-purple-500 bg-white dark:bg-card">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Portfolio Value</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-4xl font-bold text-foreground">
                            {currencySymbol}{totalInvestments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {investments?.length || 0} {investments?.length === 1 ? "investment" : "investments"}
                        </p>
                    </CardContent>
                </div>

                {investments && investments.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {investments.map((investment) => (
                            <div key={investment.id} className="bento-card p-5 bg-white dark:bg-card hover:bg-secondary/20 block group">
                                <div className="flex flex-col h-full justify-between gap-6">
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-semibold text-lg truncate pr-2">{investment.name}</h3>
                                        <div className="shrink-0 p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                            <TrendingUpIcon className="size-4" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {currencySymbol}{Number(investment.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-muted-foreground">
                                                Added {new Date(investment.created_at).toLocaleDateString()}
                                            </p>
                                            {investment.description && (
                                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full max-w-[50%] truncate">
                                                    {investment.description}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <TrendingUpIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No investments yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start building your investment portfolio to grow your wealth
                            </p>
                            <AddInvestmentDialog />
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout >
    )
}
