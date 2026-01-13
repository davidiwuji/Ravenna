import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsIcon } from "lucide-react"
import { cookies } from "next/headers"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DeleteDataButton } from "@/components/delete-data-button"
import { getLatestExchangeRate } from "@/lib/utils"

export default async function SettingsPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    async function updateCurrency(formData: FormData) {
        "use server"
        const newCurrency = formData.get("currency") as string
        const oldCurrency = profile?.currency || "USD"

        if (newCurrency === oldCurrency) return

        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // 1. Get exchange rate from old currency to new currency
        const rate = await getLatestExchangeRate(oldCurrency, newCurrency)

        // 2. Update Assets
        const { data: assets } = await supabase.from("assets").select("id, value").eq("user_id", user.id)
        if (assets) {
            for (const asset of assets) {
                await supabase.from("assets").update({ value: asset.value * rate }).eq("id", asset.id)
            }
        }

        // 3. Update Liabilities
        const { data: liabilities } = await supabase.from("liabilities").select("id, amount").eq("user_id", user.id)
        if (liabilities) {
            for (const liability of liabilities) {
                await supabase.from("liabilities").update({ amount: liability.amount * rate }).eq("id", liability.id)
            }
        }

        // 4. Update Expenses
        const { data: expenses } = await supabase.from("expenses").select("id, amount").eq("user_id", user.id)
        if (expenses) {
            for (const expense of expenses) {
                await supabase.from("expenses").update({ amount: expense.amount * rate }).eq("id", expense.id)
            }
        }

        // 5. Update Trades (PnL only)
        const { data: trades } = await supabase.from("trades").select("id, profit_loss").eq("user_id", user.id)
        if (trades) {
            for (const trade of trades) {
                if (trade.profit_loss) {
                    await supabase.from("trades").update({ profit_loss: trade.profit_loss * rate }).eq("id", trade.id)
                }
            }
        }

        // 6. Update Profile
        await supabase
            .from("user_profiles")
            .update({ currency: newCurrency })
            .eq("user_id", user?.id)

        redirect("/settings")
    }

    return (
        <MainLayout>
            <div className="space-y-6 animate-slide-in max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage preferences for your Casa
                    </p>
                </div>

                <div className="grid gap-6">
                    <div className="bento-card p-6 border bg-white dark:bg-card">
                        <h3 className="text-lg font-semibold mb-1">Profile</h3>
                        <p className="text-sm text-muted-foreground mb-6">Your personal account details</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Full Name</span>
                                <div className="p-3 bg-secondary/30 rounded-lg text-sm font-medium">
                                    {profile?.full_name || "Not set"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email Address</span>
                                <div className="p-3 bg-secondary/30 rounded-lg text-sm font-medium">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bento-card p-6 border bg-white dark:bg-card">
                        <h3 className="text-lg font-semibold mb-1">Preferences</h3>
                        <p className="text-sm text-muted-foreground mb-6">manage setting for your ravenna</p>

                        <div className="space-y-6">
                            <form action={updateCurrency} className="max-w-xs">
                                <div className="space-y-3">
                                    <Label htmlFor="currency">Default Currency</Label>
                                    <div className="flex gap-2">
                                        <select
                                            name="currency"
                                            id="currency"
                                            defaultValue={profile?.currency || "USD"}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="NGN">NGN (₦)</option>
                                        </select>
                                        <Button type="submit" size="sm">Save</Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">This symbol will be used across your Casa.</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="bento-card p-6 border border-destructive/20 bg-destructive/5 dark:bg-destructive/10">
                    <h3 className="text-lg font-semibold mb-1 text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-6">Irreversible actions</p>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-muted-foreground">
                            Once you delete your data, there is no going back. Please be certain.
                        </div>
                        <DeleteDataButton />
                    </div>
                </div>
            </div>

        </MainLayout >
    )
}
