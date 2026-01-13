export default function Loading() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
            <div className="relative flex flex-col items-center">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>

                {/* Logo - No Container */}
                <div className="relative z-10 animate-slide-in">
                    <span className="text-6xl font-bold text-primary animate-pulse">R</span>
                </div>


            </div>
        </div>
    )
}
