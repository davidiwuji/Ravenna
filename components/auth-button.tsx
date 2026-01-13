"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogInIcon, LogOutIcon, UserIcon } from "lucide-react"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

export function AuthButton() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        }

        getUser()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/auth/login")
        router.refresh()
    }

    if (user) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden md:inline text-muted-foreground">
                        {user.email}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2"
                >
                    <LogOutIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                </Button>
            </div>
        )
    }

    return (
        <Button
            variant="default"
            size="sm"
            onClick={() => router.push("/auth/login")}
            className="gap-2"
        >
            <LogInIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Sign In</span>
        </Button>
    )
}
