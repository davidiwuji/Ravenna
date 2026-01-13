import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCardIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cookies } from "next/headers"
import { getCurrencySymbol } from "@/lib/utils"
import { AddLiabilityDialog } from "@/components/dialogs/add-liability-dialog"

export default async function LiabilitiesPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const { data: liabilities } = await supabase
        .from("liabilities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("currency")
        .eq("user_id", user.id)
        .single()

    const currencySymbol = getCurrencySymbol(profile?.currency)

    const totalAmount = liabilities?.reduce((sum, liability) => sum + Number(liability.amount), 0) || 0

    return (
        <MainLayout>
            <div className="space-y-6 animate-slide-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Liabilities</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your debts and financial obligations
                        </p>
                    </div>
                    <AddLiabilityDialog />
                </div>

                <div className="bento-card p-6 border-l-4 border-l-orange-500 bg-white dark:bg-card">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Liabilities</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-4xl font-bold text-foreground">
                            {currencySymbol}{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {liabilities?.length || 0} {liabilities?.length === 1 ? "liability" : "liabilities"} tracked
                        </p>
                    </CardContent>
                </div>

                {liabilities && liabilities.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {liabilities.map((liability) => (
                            <div key={liability.id} className="bento-card p-5 bg-white dark:bg-card">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-semibold text-lg truncate pr-2">{liability.name}</h3>
                                    <Badge variant="outline" className="capitalize bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30">
                                        {liability.type.replace("_", " ")}
                                    </Badge>
                                </div>
                                {liability.description && (
                                    <p className="text-sm text-muted-foreground truncate mb-4">{liability.description}</p>
                                )}

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Amount</span>
                                        <span className="text-xl font-bold text-foreground">
                                            {currencySymbol}{Number(liability.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    {liability.interest_rate && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Interest Rate</span>
                                            <span className="font-semibold bg-secondary/50 px-2 py-0.5 rounded-md">
                                                {Number(liability.interest_rate).toFixed(2)}%
                                            </span>
                                        </div>
                                    )}
                                    {liability.due_date && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Due Date</span>
                                            <span className="font-medium text-foreground">
                                                {new Date(liability.due_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CreditCardIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No liabilities tracked</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start tracking your debts to get a clear picture of your obligations
                            </p>
                            <AddLiabilityDialog />
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    )
}
