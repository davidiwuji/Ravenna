"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "lucide-react"
import { addTrade } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea" // Assuming textarea exists or fallback to Input

export function AddTradeDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        try {
            await addTrade(formData)
            setOpen(false)
            router.refresh()
        } catch (error) {
            console.error("Failed to add trade", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 h-10 rounded-xl shadow-sm">
                    <PlusIcon className="h-4 w-4" />
                    Add Trade
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Log Trade</DialogTitle>
                    <DialogDescription>
                        Record a new trade entry.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="symbol">Symbol (Exness)</Label>
                            <select
                                id="symbol"
                                name="symbol"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <optgroup label="Majors">
                                    <option value="EURUSD">EURUSD</option>
                                    <option value="GBPUSD">GBPUSD</option>
                                    <option value="USDJPY">USDJPY</option>
                                    <option value="USDCHF">USDCHF</option>
                                    <option value="AUDUSD">AUDUSD</option>
                                    <option value="NZDUSD">NZDUSD</option>
                                    <option value="USDCAD">USDCAD</option>
                                </optgroup>
                                <optgroup label="Minors & Crosses">
                                    <option value="AUDCAD">AUDCAD</option>
                                    <option value="AUDCHF">AUDCHF</option>
                                    <option value="AUDJPY">AUDJPY</option>
                                    <option value="AUDNZD">AUDNZD</option>
                                    <option value="CADCHF">CADCHF</option>
                                    <option value="CADJPY">CADJPY</option>
                                    <option value="CHFJPY">CHFJPY</option>
                                    <option value="EURAUD">EURAUD</option>
                                    <option value="EURCAD">EURCAD</option>
                                    <option value="EURCHF">EURCHF</option>
                                    <option value="EURGBP">EURGBP</option>
                                    <option value="EURJPY">EURJPY</option>
                                    <option value="EURNZD">EURNZD</option>
                                    <option value="GBPAUD">GBPAUD</option>
                                    <option value="GBPCAD">GBPCAD</option>
                                    <option value="GBPCHF">GBPCHF</option>
                                    <option value="GBPJPY">GBPJPY</option>
                                    <option value="GBPNZD">GBPNZD</option>
                                    <option value="NZDCAD">NZDCAD</option>
                                    <option value="NZDCHF">NZDCHF</option>
                                    <option value="NZDJPY">NZDJPY</option>
                                </optgroup>
                                <optgroup label="Metals & Crypto">
                                    <option value="XAUUSD">XAUUSD (Gold)</option>
                                    <option value="BTCUSD">BTCUSD</option>
                                </optgroup>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                name="type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="buy">Long (Buy)</option>
                                <option value="sell">Short (Sell)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Lot Size</Label>
                            <Input id="quantity" name="quantity" type="number" step="0.01" placeholder="0.01" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entry_price">Entry Price</Label>
                            <Input id="entry_price" name="entry_price" type="number" step="any" placeholder="0.00" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exit_price">Exit Price</Label>
                            <Input id="exit_price" name="exit_price" type="number" step="any" placeholder="Optional" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="leverage">Leverage</Label>
                            <select
                                id="leverage"
                                name="leverage"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select Leverage</option>
                                <option value="2">1:2</option>
                                <option value="20">1:20</option>
                                <option value="50">1:50</option>
                                <option value="100">1:100</option>
                                <option value="200">1:200</option>
                                <option value="400">1:400</option>
                                <option value="500">1:500</option>
                                <option value="600">1:600</option>
                                <option value="800">1:800</option>
                                <option value="1000">1:1000</option>
                                <option value="2000">1:2000</option>
                                <option value="2147483647">1:Unlimited</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profit_loss">Manual P&L (Your Currency)</Label>
                            <Input id="profit_loss" name="profit_loss" type="number" step="any" placeholder="Optional override" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input id="notes" name="notes" placeholder="Strategy rationale, emotions, etc." />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Logging..." : "Log Trade"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
