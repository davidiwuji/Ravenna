import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getCurrencySymbol(currencyCode: string | null | undefined): string {
    if (!currencyCode) return '$'

    switch (currencyCode) {
        case 'EUR': return '€'
        case 'GBP': return '£'
        case 'NGN': return '₦'
        default: return '$'
    }
}

export async function getLatestExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1

    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${from}`)
        const data = await response.json()

        if (data.result === "success" && data.rates[to]) {
            return data.rates[to]
        }
        console.warn(`Could not find exchange rate for ${from} to ${to}, defaulting to 1`)
        return 1
    } catch (error) {
        console.error("Failed to fetch exchange rate:", error)
        return 1
    }
}
