import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { withAuth } from '../../utils/withAuth'
import { useAuth } from '../../contexts/AuthContext'
import { FacebookPost, TrackedEntity, Post, Reaction } from '../../../generated/prisma/client'
import {
  Zap,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Header component shared between error and success states
const Header = ({ user, logout }: { user: { email?: string }; logout: () => void }) => (
  <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-foreground">Spark</span>
      </Link>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:block">{user?.email}</span>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </div>
  </header>
)

type Data = Post & {
  reactions: (Reaction & { trackedEntity: TrackedEntity })[]
  facebookPost: FacebookPost
  trackedEntity: TrackedEntity
}

interface PostDetailProps {
  user: {
    id: string
    email?: string
  }
  post: Data | null
  error?: string
}

export default function PostDetail({ user: serverUser, post, error }: PostDetailProps) {
  const { user: clientUser, logout } = useAuth()
  const user = clientUser || serverUser

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} logout={logout} />
        <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
          <Card className="py-16">
            <CardContent className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <p className="mb-4 text-destructive">{error || 'Post not found'}</p>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} logout={logout} />

      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Badge
            variant={post.trackedEntity.type === 'OWN' ? 'destructive-light' : 'secondary'}
            className="w-fit"
          >
            {post.trackedEntity.name}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Processed at: {format(new Date(post.createdAt), 'MMMM d, yyyy · HH:mm')}
          </span>
        </div>

        {/* Original Post Card */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Original Post
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Category:</span>
                <Badge
                  variant={
                    post.categoryEuSk === 'EU'
                      ? 'blue'
                      : post.categoryEuSk === 'SK'
                        ? 'destructive-light'
                        : 'secondary'
                  }
                >
                  {post.categoryEuSk ?? 'NONE'}
                </Badge>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap leading-relaxed text-foreground">
              {post.facebookPost.text || 'Original post has no text'}
            </p>

            <Separator />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{post.facebookPost.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4 text-blue-400" />
                  <span className="font-medium">{post.facebookPost.comments.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                  <span className="font-medium">{post.facebookPost.shares.toLocaleString()}</span>
                </div>
                {post.facebookPost.viewsCount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">
                      {post.facebookPost.viewsCount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={post.facebookPost.url} target="_blank" rel="noopener noreferrer">
                  View on Facebook
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Posted: {format(post.facebookPost.postedAt, 'MMMM d, yyyy · HH:mm')}
            </p>
          </CardContent>
        </Card>

        {/* Generated Reactions */}
        {post.reactions.map((reaction, index) => (
          <Card key={reaction.id} className="mb-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                {post.trackedEntity.type === 'OWN'
                  ? `Comment #${index + 1}`
                  : `Reaction by: ${reaction.trackedEntity.name} - #${index + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed text-foreground">{reaction.text}</p>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authResult = await withAuth()(context)

  if ('redirect' in authResult) {
    return authResult
  }

  const { id } = context.params as { id: string }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/posts/${id}?api_secret=${process.env.API_SECRET}`,
    )

    if (!res.ok) {
      return {
        props: {
          ...authResult.props,
          post: null,
          error: 'Post not found',
        },
      }
    }

    const post = await res.json()

    return {
      props: {
        ...authResult.props,
        post,
      },
    }
  } catch (error) {
    return {
      props: {
        ...authResult.props,
        post: null,
        error: 'Failed to fetch post',
      },
    }
  }
}
