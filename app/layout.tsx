import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Ravenna",
    description:
        "Modern personal finance tracker with asset management, expense tracking, investment portfolio, and trading journal",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
                <Suspense fallback={<div>Loading...</div>}>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                        {children}
                    </ThemeProvider>
                </Suspense>
                <Analytics />
            </body>
        </html>
    )
}
