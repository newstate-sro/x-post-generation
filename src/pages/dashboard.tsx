import { withAuth } from '../utils/withAuth'
import { useAuth } from '../contexts/AuthContext'

interface DashboardProps {
  user: {
    id: string
    email?: string
  }
}

export default function Dashboard({ user: serverUser }: DashboardProps) {
  const { user: clientUser, logout } = useAuth()

  // Use server user as fallback
  const user = clientUser || serverUser

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold text-black dark:text-zinc-50">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{user?.email}</span>
            <button
              onClick={logout}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-semibold text-black dark:text-zinc-50">
            Protected Dashboard
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            This page is protected and only accessible to authenticated users.
          </p>
          <div className="mt-4 rounded-md bg-zinc-100 p-4 dark:bg-zinc-800">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong>User ID:</strong> {user?.id}
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong>Email:</strong> {user?.email || 'N/A'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

// Protect this page with authentication
export const getServerSideProps = withAuth()
