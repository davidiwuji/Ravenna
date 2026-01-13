export async function getExchangeRate(fromCurrency: string, toCurrency: string = 'USD'): Promise<number> {
    try {
        // Using open.er-api.com for free exchange rates
        const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`, { next: { revalidate: 3600 } }); // Cache for 1 hour
        const data = await response.json();

        if (data && data.rates && data.rates[toCurrency]) {
            return data.rates[toCurrency];
        }

        console.error(`Could not find rate for ${toCurrency} in response for ${fromCurrency}`);
        return 0;
    } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        return 0;
    }
}
