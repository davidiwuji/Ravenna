"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md animate-slide-in">
                <div className="text-center mb-8">
                    <div className="text-4xl font-bold text-primary mb-4 tracking-tighter">
                        R
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center mb-4">
                                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                    <CheckCircleIcon className="h-6 w-6" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium">Check your email</h3>
                            <p className="text-muted-foreground text-sm">
                                We have sent a password reset link to <strong>{email}</strong>.
                            </p>
                            <Button asChild className="w-full mt-4" variant="outline">
                                <Link href="/auth/login">
                                    Back to Login
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="h-11 bg-muted/30 border-border/50 focus:bg-background transition-colors"
                                />
                            </div>
                            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                                {loading ? "Sending Link..." : "Send Reset Link"}
                            </Button>
                            <div className="text-center text-sm mt-4">
                                <Link
                                    href="/auth/login"
                                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                                >
                                    <ArrowLeftIcon className="h-3 w-3" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
