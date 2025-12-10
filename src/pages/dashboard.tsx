import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { withAuth } from '../utils/withAuth'
import { useAuth } from '../contexts/AuthContext'
import { FacebookPost, Post, Reaction, TrackedEntity } from '../../generated/prisma/client'
import { format } from 'date-fns'
import {
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Data = Post & {
  reactions: Reaction[]
  facebookPost: FacebookPost
  trackedEntity: TrackedEntity
}

type Pagination = {
  limit: number
  total: number
  currentPage: number
  totalPages: number
}

type ApiResponse = {
  data: Data[]
  pagination: Pagination
}

interface DashboardProps {
  user: {
    id: string
    email?: string
  }
}

const LIMIT = 10

export default function Dashboard({ user: serverUser }: DashboardProps) {
  const { user: clientUser, logout } = useAuth()
  const user = clientUser || serverUser

  const [posts, setPosts] = useState<Data[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReactions = useCallback(async (pageNum: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/posts?api_secret=${process.env.NEXT_PUBLIC_API_SECRET}&limit=${LIMIT}&page=${pageNum}`,
      )
      if (!res.ok) throw new Error('Failed to fetch posts')
      const data: ApiResponse = await res.json()
      setPosts(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReactions(page)
  }, [page, fetchReactions])

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Spark</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Posts</h1>
            {pagination && (
              <p className="mt-1 text-sm text-muted-foreground">
                Showing {posts.length} of {pagination.total} posts
              </p>
            )}
          </div>
          {pagination && (
            <Card className="py-3 sm:py-2">
              <CardContent className="flex items-center gap-2 px-4 py-0">
                <span className="text-2xl font-bold text-foreground">{pagination.total}</span>
                <span className="text-sm text-muted-foreground">total</span>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Content Card */}
        <Card>
          {loading ? (
            <CardContent className="py-12">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          ) : error ? (
            <CardContent className="py-12">
              <Alert variant="destructive" className="mx-auto max-w-md">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
          ) : posts.length === 0 ? (
            <CardContent className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No posts found</p>
            </CardContent>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="divide-y lg:hidden">
                {posts.map((post) => (
                  <div key={post.id} className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge
                        variant={
                          post.trackedEntity.type === 'OWN' ? 'destructive-light' : 'secondary'
                        }
                      >
                        {post.trackedEntity.name}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {format(post.facebookPost.postedAt, 'dd.MM.yyyy')}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/posts/${post.id}`}>
                            View
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <a
                      href={post.facebookPost.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-2 block text-foreground line-clamp-2 hover:underline"
                    >
                      {post.facebookPost.text || 'Original post has no text'}
                    </a>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {post.reactions.length} reactions
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" /> {post.facebookPost.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4 text-blue-400" />{' '}
                        {post.facebookPost.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" /> {post.facebookPost.shares}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden lg:block">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Entity</TableHead>
                      <TableHead className="w-[28%]">Post</TableHead>
                      <TableHead className="w-[8%]">Category</TableHead>
                      <TableHead className="w-[10%]">Reactions</TableHead>
                      <TableHead className="w-[130px]">Engagement</TableHead>
                      <TableHead className="w-[90px]">Posted at</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <Badge
                            variant={
                              post.trackedEntity.type === 'OWN' ? 'destructive-light' : 'secondary'
                            }
                            className="truncate max-w-full"
                          >
                            {post.trackedEntity.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={post.facebookPost.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-base text-foreground hover:underline"
                              >
                                <span className="truncate">
                                  {post.facebookPost.text || 'Original post has no text'}
                                </span>
                                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-sm">
                              <p className="whitespace-pre-wrap">
                                {post.facebookPost.text || 'Original post has no text'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              post.categoryEuSk === 'EU'
                                ? 'blue'
                                : post.categoryEuSk === 'SK'
                                  ? 'destructive-light'
                                  : 'secondary'
                            }
                          >
                            {post.categoryEuSk}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex truncate text-base text-muted-foreground">
                            {post.reactions.length} reactions
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 text-base text-muted-foreground">
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span>{post.facebookPost.likes}</span>
                              </TooltipTrigger>
                              <TooltipContent>Likes</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4 text-blue-400" />
                                <span>{post.facebookPost.comments}</span>
                              </TooltipTrigger>
                              <TooltipContent>Comments</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger className="flex items-center gap-1">
                                <Share2 className="h-4 w-4" />
                                <span>{post.facebookPost.shares}</span>
                              </TooltipTrigger>
                              <TooltipContent>Shares</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell className="text-base text-muted-foreground">
                          {format(post.facebookPost.postedAt, 'dd.MM.yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" asChild>
                            <Link href={`/posts/${post.id}`}>
                              View
                              <ChevronRight className="h-5 w-5" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Page</span>
                      <select
                        value={page}
                        onChange={(e) => setPage(Number(e.target.value))}
                        className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <span className="text-sm text-muted-foreground">
                        of {pagination.totalPages}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </Card>
      </main>
    </div>
  )
}

export const getServerSideProps = withAuth()
