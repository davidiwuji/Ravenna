"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { getLatestExchangeRate } from "./utils"

export async function addAsset(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const name = formData.get("name") as string
    const value = formData.get("value") as string
    const type = formData.get("type") as string

    const { error } = await supabase.from("assets").insert({
        user_id: user.id,
        name,
        value: Number(value),
        type
    })

    if (error) {
        console.error("Error adding asset:", error)
        return { error: error.message }
    }

    revalidatePath("/assets")
    revalidatePath("/") // Update dashboard
    return { success: true }
}

export async function addLiability(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const name = formData.get("name") as string
    const amount = formData.get("amount") as string
    const type = formData.get("type") as string

    const { error } = await supabase.from("liabilities").insert({
        user_id: user.id,
        name,
        amount: Number(amount),
        type
    })

    if (error) {
        console.error("Error adding liability:", error)
        return { error: error.message }
    }

    revalidatePath("/liabilities")
    revalidatePath("/")
    return { success: true }
}

export async function addExpense(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const description = formData.get("description") as string
    const amount = formData.get("amount") as string
    const category = formData.get("category") as string
    const date = formData.get("date") as string || new Date().toISOString()

    const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        description,
        amount: Number(amount),
        category,
        date
    })

    if (error) {
        console.error("Error adding expense:", error)
        return { error: error.message }
    }

    revalidatePath("/expenses")
    revalidatePath("/")
    return { success: true }
}

export async function addInvestment(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const name = formData.get("name") as string
    const value = formData.get("value") as string
    const description = formData.get("description") as string

    // Investments are technically Assets with type="investment" in this schema?
    // Let's check the investments page logic again. 
    // Step 426: .eq("type", "investment"). Yes.

    const { error } = await supabase.from("assets").insert({
        user_id: user.id,
        name,
        value: Number(value),
        type: "investment",
        description // Assuming description column exists or we might fail. 
        // Wait, step 426 showed 'investment.description'. 
        // Let's verify schema later if it fails, but for now assuming yes.
    })

    // Actually, looking at Step 426, line 89: investment.description exists.
    // BUT, is it on the 'assets' table? 
    // Step 426 line 23: .from("assets").
    // So yes, assets table has description.

    if (error) {
        console.error("Error adding investment:", error)
        return { error: error.message }
    }

    revalidatePath("/investments")
    revalidatePath("/")
    return { success: true }
}

export async function addTrade(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const symbol = formData.get("symbol") as string
    const type = formData.get("type") as string
    const quantity = formData.get("quantity") as string
    const entry_price = formData.get("entry_price") as string
    const exit_price = formData.get("exit_price") as string
    const notes = formData.get("notes") as string
    const leverage = formData.get("leverage") as string

    const tradeData: any = {
        user_id: user.id,
        symbol,
        type, // 'buy' or 'sell'
        quantity: Number(quantity),
        entry_price: Number(entry_price),
        trade_date: new Date().toISOString()
    }

    if (leverage) tradeData.leverage = Number(leverage)

    // Fetch user currency to convert P&L from USD to Base Currency
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("currency")
        .eq("user_id", user.id)
        .single()

    const userCurrency = profile?.currency || "USD"
    const rate = await getLatestExchangeRate("USD", userCurrency)

    const manualPnL = formData.get("profit_loss") as string

    if (manualPnL) {
        tradeData.profit_loss = Number(manualPnL)
    } else if (exit_price) {
        tradeData.exit_price = Number(exit_price)

        // Helper to get contract size
        const getContractSize = (sym: string) => {
            if (sym === "XAUUSD") return 100
            if (sym === "BTCUSD") return 1
            // Default Standard Lot for Forex
            return 100000
        }

        const contractSize = getContractSize(symbol)
        const lots = Number(quantity)
        const entry = Number(entry_price)
        const exit = Number(exit_price)

        // Auto calc P&L if exit price exists
        let rawPnL = 0
        if (type === 'buy') {
            rawPnL = (exit - entry) * lots * contractSize
        } else {
            // For short selling
            rawPnL = (entry - exit) * lots * contractSize
        }

        // Apply Exchange Rate to get P&L in User's Base Currency
        tradeData.profit_loss = rawPnL * rate
    }

    if (notes) tradeData.notes = notes

    const { error } = await supabase.from("trades").insert(tradeData)

    if (error) {
        console.error("Error adding trade:", error)
        return { error: error.message }
    }

    revalidatePath("/trading")
    revalidatePath("/")
    return { success: true }
}

export async function deleteAllData() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // 1. Delete Trades
    const { error: tradesError } = await supabase.from("trades").delete().eq("user_id", user.id)
    if (tradesError) console.error("Error deleting trades:", tradesError)

    // 2. Delete Expenses
    const { error: expError } = await supabase.from("expenses").delete().eq("user_id", user.id)
    if (expError) console.error("Error deleting expenses:", expError)

    // 3. Delete Liabilities
    const { error: liabError } = await supabase.from("liabilities").delete().eq("user_id", user.id)
    if (liabError) console.error("Error deleting liabilities:", liabError)

    // 4. Delete Assets (includes Investments)
    const { error: assetError } = await supabase.from("assets").delete().eq("user_id", user.id)
    if (assetError) console.error("Error deleting assets:", assetError)

    revalidatePath("/")
    return { success: true }
}
