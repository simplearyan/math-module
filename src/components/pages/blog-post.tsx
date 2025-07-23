"use client"

import { Input } from "@/components/ui/input"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, ThumbsUp, MessageSquare, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
// import { blogPosts, type BlogPost } from "@/data/blog-data"
import Link from "next/link"
import { useParams } from "next/navigation"
// import ReactMarkdown from "react-markdown"

// Define the post type or import it from your types
type BlogPost = {
  id: string
  title: string
  category?: string
  tags?: string[]
  author?: string | {
    name: string 
    avatar?: string
    role?: string
  }
  coverImage?: string
  publishedAt?: string | Date
  readingTime?: string
  excerpt?: string
  content?: React.ReactNode | string;
}
 
interface BlogPostPageProps {
  post: BlogPost
  relatedPosts?: BlogPost[]
}

export function BlogPostPage({ post, relatedPosts = [] }: BlogPostPageProps) {

  const params = useParams()
//   const [post, setPost] = useState<BlogPost | null>(null)
//   const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

//   useEffect(() => {
//     if (params.id) {
//       const foundPost = blogPosts.find((p) => p.id === params.id)
//       setPost(foundPost || null)

//       if (foundPost) {
//         // Find related posts (same category or shared tags)
//         const related = blogPosts
//           .filter(
//             (p) =>
//               p.id !== foundPost.id &&
//               (p.category === foundPost.category || p.tags.some((tag) => foundPost.tags.includes(tag))),
//           )
//           .slice(0, 3)
//         setRelatedPosts(related)
//       }
//     }
//   }, [params.id])

  const authorName = typeof post.author === "string" 
    ? post.author 
    : post.author?.name || "Anonymous";

  const authorAvatar = typeof post.author === "object" && post.author.avatar
    ? post.author.avatar 
    : "/placeholder.svg";

  const authorRole = typeof post.author === "object" 
    ? post.author?.role 
    : undefined;


  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Post not found</h2>
          <p className="text-muted-foreground mb-4">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-background to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>

            <Badge className="mb-4">{post.category}</Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={authorAvatar} alt={authorName} />
                  <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{authorName}</p>
                  {authorRole && <p className="text-xs text-muted-foreground">{authorRole}</p>}
                </div>

              </div>

              {post.publishedAt ? (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm italic">Date not available</div>
              )}


              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{post.readingTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="aspect-[21/9] overflow-hidden rounded-2xl">
              <img
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Social Share Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:w-16 flex md:flex-col items-center gap-4"
              >
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-transparent">
                  <ThumbsUp className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-transparent">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-transparent">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-transparent">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex-1"
              >
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {/* <ReactMarkdown>{post.content}</ReactMarkdown> */}
                  {post.content}
                </div>

                {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-2">
                        <Tag className="h-5 w-5 text-muted-foreground" />
                        {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-full">
                            {tag}
                        </Badge>
                        ))}
                    </div>
                    )}


                {/* Author Bio */}
                <div className="mt-12 p-6 bg-muted/30 rounded-2xl">
                  <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={authorAvatar} alt={authorName} />
                        <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{authorName}</p>
                        {authorRole && <p className="text-xs text-muted-foreground">{authorRole}</p>}
                      </div>

                  </div>
                  <p className="mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${relatedPost.id}`}>
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 group">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={relatedPost.coverImage || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge className="mb-3">{relatedPost.category}</Badge>
                        <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                                <img
                                  src={
                                    typeof relatedPost.author === "object" && relatedPost.author?.avatar
                                      ? relatedPost.author.avatar
                                      : "/placeholder.svg"
                                  }
                                  alt={
                                    typeof relatedPost.author === "string"
                                      ? relatedPost.author
                                      : relatedPost.author?.name || "Author"
                                  }
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-xs">
                                {typeof relatedPost.author === "string"
                                  ? relatedPost.author
                                  : relatedPost.author?.name || "Anonymous"}
                              </span>

                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{relatedPost.readingTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
            <p className="text-muted-foreground mb-8">
              Get the latest articles, tutorials, and updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-1 h-12 px-4 rounded-full" />
              <Button className="h-12 px-8 rounded-full">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
