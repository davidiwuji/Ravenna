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
import { Trash2Icon } from "lucide-react"
import { deleteAllData } from "@/lib/actions"
import { useRouter } from "next/navigation"

export function DeleteDataButton() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setLoading(true)
        try {
            await deleteAllData()
            setOpen(false)
            router.refresh()
        } catch (error) {
            console.error("Failed to delete data", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto rounded-xl">
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Erase All Data
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-destructive">Erase All Data?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your assets, liabilities, transactions, and trading history from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? "Erasing..." : "Yes, Erase Everything"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
