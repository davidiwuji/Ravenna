import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircleIcon } from "lucide-react"

export default function AuthCodeError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
            <Card className="w-full max-w-md glass">
                <CardHeader className="text-center">
                    <XCircleIcon className="mx-auto h-12 w-12 text-destructive mb-4" />
                    <CardTitle>Authentication Error</CardTitle>
                    <CardDescription>
                        There was an error during authentication. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Button asChild>
                        <Link href="/auth/login">Back to Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
