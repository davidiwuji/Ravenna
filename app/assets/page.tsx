import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"
import { getCurrencySymbol } from "@/lib/utils"
import { AddAssetDialog } from "@/components/dialogs/add-asset-dialog"

export default async function AssetsPage() {
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
        .order("created_at", { ascending: false })

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    const currencySymbol = getCurrencySymbol(profile?.currency)

    const totalValue = assets?.reduce((sum, asset) => sum + Number(asset.value), 0) || 0

    return (
        <MainLayout>
            <div className="space-y-6 animate-slide-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Assets</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your assets and track their value
                        </p>
                    </div>
                    <AddAssetDialog />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="bento-card p-6 border-l-4 border-l-blue-500 bg-white dark:bg-card">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Assets</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-4xl font-bold text-foreground">
                                {currencySymbol}{totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {assets?.length || 0} {assets?.length === 1 ? "asset" : "assets"} tracked
                            </p>
                        </CardContent>
                    </div>

                    <div className="bento-card p-6 border-l-4 border-l-green-500 bg-white dark:bg-card">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available Cash</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-4xl font-bold text-foreground">
                                {currencySymbol}{(assets?.filter(a => a.type === 'cash').reduce((sum, a) => sum + Number(a.value), 0) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                Liquid funds
                            </p>
                        </CardContent>
                    </div>
                </div>

                {assets && assets.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {assets.map((asset) => (
                            <div key={asset.id} className="bento-card p-5 bg-white dark:bg-card hover:bg-secondary/20 block">
                                <div className="flex flex-col h-full justify-between gap-4">
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-lg truncate pr-2">{asset.name}</h3>
                                            <div className="shrink-0 p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                <WalletIcon className="size-4" />
                                            </div>
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground capitalize mt-1 px-2 py-0.5 bg-secondary rounded-full w-fit">
                                            {asset.type}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-foreground">
                                            {currencySymbol}{Number(asset.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Added {new Date(asset.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <WalletIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No assets yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start tracking your assets to get a clear picture of your wealth
                            </p>
                            <AddAssetDialog />
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    )
}
