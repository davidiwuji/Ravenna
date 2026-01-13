import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCartIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cookies } from "next/headers"
import { getCurrencySymbol } from "@/lib/utils"
import { AddExpenseDialog } from "@/components/dialogs/add-expense-dialog"

export default async function ExpensesPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(50)

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyExpenses = expenses?.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    }) || []

    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount)
        return acc
    }, {} as Record<string, number>)

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    const currencySymbol = getCurrencySymbol(profile?.currency)

    return (
        <MainLayout>
            <div className="space-y-6 animate-slide-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Expenses</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your spending and manage your budget
                        </p>
                    </div>
                    <AddExpenseDialog />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="bento-card p-6 border-l-4 border-l-red-500 bg-white dark:bg-card">
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">This Month</CardTitle>
                            <CardDescription className="text-xs">
                                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-4xl font-bold text-foreground">
                                {currencySymbol}{monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {monthlyExpenses.length} {monthlyExpenses.length === 1 ? "expense" : "expenses"}
                            </p>
                        </CardContent>
                    </div>

                    <div className="bento-card p-6 bg-white dark:bg-card">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-lg font-semibold">Top Categories</CardTitle>
                            <CardDescription className="text-sm">Where you're spending most</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {Object.keys(categoryTotals).length > 0 ? (
                                <div className="space-y-3">
                                    {Object.entries(categoryTotals)
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 3)
                                        .map(([category, total]) => (
                                            <div key={category} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                                                <Badge variant="outline" className="capitalize border-transparent bg-white dark:bg-card shadow-sm">
                                                    {category}
                                                </Badge>
                                                <span className="font-semibold text-foreground">{currencySymbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No data yet</p>
                            )}
                        </CardContent>
                    </div>
                </div>

                {expenses && expenses.length > 0 ? (
                    <div className="bento-card p-0 bg-white dark:bg-card overflow-hidden">
                        <CardHeader className="p-6 border-b border-border/50">
                            <CardTitle className="text-lg font-semibold">Recent Expenses</CardTitle>
                            <CardDescription>Your latest transactions</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {expenses.map((expense) => (
                                    <div key={expense.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                                        <div>
                                            <p className="font-medium text-foreground">{expense.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="capitalize text-xs rounded-md px-1.5 py-0.5 font-normal">
                                                    {expense.category}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(expense.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-foreground">
                                                -{currencySymbol}{Number(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <ShoppingCartIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No expenses tracked</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Start tracking your daily expenses to manage your budget better
                            </p>
                            <AddExpenseDialog />
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    )
}
