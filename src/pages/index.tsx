import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Zap, ArrowRight, LogOut } from 'lucide-react'

export default function Home() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-16 w-16 rounded-2xl" />
          <Skeleton className="mx-auto h-8 w-32" />
          <Skeleton className="mx-auto h-4 w-48" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-muted/50 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-muted/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo & Title */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">Spark</h1>
          <p className="text-base text-muted-foreground">AI-powered political reactions.</p>
          <p className="mt-1 text-sm text-muted-foreground/80">Respond smarter, not harder.</p>
        </div>

        {user ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Logged in as
                </p>
                <p className="truncate text-sm text-foreground">{user.email}</p>
              </CardContent>
            </Card>

            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" className="w-full" size="lg" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full" size="lg">
            <Link href="/login">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Spark
      </p>
    </div>
  )
}
