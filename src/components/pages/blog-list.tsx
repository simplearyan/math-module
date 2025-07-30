"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { blogPosts } from "@/data/blog-data"
import Link from "next/link";

// Adjust to your Post type!
type Post = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  author?:
    | string
    | {
        name?: string;
        avatar?: string;
      };
  date: string;
  category?: string[]; // Optional!
  tags?: string[]; // Optional!
  featured?: boolean;
  coverImage?: string;
  imageSrc?: string; // Use this for the main post image
  excerpt?: string;
  publishedAt?: string | Date; // Use Date type if you prefer
  readingTime?: string;
};

type CategoryType = string;

export function BlogList({ posts }: { posts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Unique categories
  const allCategories = posts.flatMap((post) => post.category || []);
  const uniqueCategories = Array.from(new Set(allCategories));
  const categories: CategoryType[] = ["All", ...uniqueCategories];

  // Filtering logic
  const filteredPosts = posts.filter((post) => {
    const lower = searchQuery.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(lower) ||
      post.description?.toLowerCase().includes(lower);

    const postTags = post.tags || [];
    const matchesTag = postTags.some((tag) =>
      tag.toLowerCase().includes(lower)
    );

    const postCategories = post.category || [];
    const matchesCategory =
      activeCategory === "All" || postCategories.includes(activeCategory);

    return (matchesSearch || matchesTag) && matchesCategory;
  });

  const featuredPosts = posts.filter((post) => !!post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-background/65 via-secondary/30 to-accent/20 text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-blue-400 to-indigo-600 text-transparent bg-clip-text"
            >
              Designali Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground mb-8"
            >
              Insights, tutorials, and inspiration for designers and creative professionals
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-xl mx-auto mb-8"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-base bg-card border rounded-xl focus:ring-2 focus:ring-primary transition-all shadow-lg"
              />
            </motion.div>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center mt-4"
            >
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList
                  className="
                    flex flex-wrap gap-2 p-2
                    bg-white/70 dark:bg-zinc-900/60
                    rounded-xl shadow-xl
                  "
                  aria-label="Filter categories"
                >
                  {categories.map((category: CategoryType) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="
                        text-sm md:text-base px-4 py-2 rounded-lg
                        font-medium transition-all
                        text-gray-700 dark:text-gray-300
                        hover:bg-indigo-50 dark:hover:bg-zinc-800/60
                        data-[state=active]:bg-indigo-600
                        data-[state=active]:text-white
                        data-[state=active]:shadow
                      "
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-gradient-to-b from-indigo-400 to-indigo-800 rounded-full" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className="overflow-hidden h-full rounded-3xl border-0
                      bg-white/90 dark:bg-zinc-900/80 shadow-2xl group hover:shadow-indigo-200
                      hover:-translate-y-1 transition-all duration-300">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={
                            post.image ||
                            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
                          }
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge className="mb-3 px-3 py-1 rounded-full text-sm tracking-wide bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-50 text-indigo-800 shadow">
                          {post.category?.[0] || "Uncategorized"}
                        </Badge>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigo-200">
                              <img
                                src={
                                  typeof post.author === "object" && post.author?.avatar
                                    ? post.author.avatar
                                    : "https://github.com/simplearyan.png"
                                }
                                alt={
                                  typeof post.author === "object" && post.author?.name
                                    ? post.author.name
                                    : typeof post.author === "string"
                                    ? post.author
                                    : "Aryan"
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {typeof post.author === "object" && post.author?.name
                                ? post.author.name
                                : typeof post.author === "string"
                                ? post.author
                                : "Aryan"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <time dateTime={post.publishedAt?.toString()}>
                                {post.publishedAt
                                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : post.date
                                }
                              </time>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.readingTime}</span>
                            </div>
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

      {/* All Posts */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">All Articles</h2>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-10">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className="overflow-hidden h-full rounded-3xl border-0 bg-white/90 dark:bg-zinc-900/90 group shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={
                            post.image ||
                            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
                          }
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge className="mb-2 px-2 py-1 bg-gray-50 dark:bg-zinc-800 text-indigo-600 dark:text-blue-300 font-semibold rounded-full text-xs">
                          {Array.isArray(post.category)
                            ? (post.category && post.category.length > 0
                                ? post.category[0]
                                : "Uncategorized")
                            : post.category || "Uncategorized"}
                        </Badge>
                        <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-3 text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-zinc-200/60">
                              <img
                                src={
                                  typeof post.author === "object" && post.author?.avatar
                                    ? post.author.avatar
                                    : "https://github.com/simplearyan.png"
                                }
                                alt={
                                  typeof post.author === "object" && post.author?.name
                                    ? post.author.name
                                    : typeof post.author === "string"
                                    ? post.author
                                    : "Aryan"
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm">
                              {typeof post.author === "object" && post.author?.name
                                ? post.author.name
                                : typeof post.author === "string"
                                ? post.author
                                : "Aryan"}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{post.readingTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="rounded-full px-8 py-4 text-base bg-white/40 shadow hover:bg-indigo-100 dark:bg-zinc-800 dark:hover:bg-zinc-900 border border-indigo-100 dark:border-zinc-700 transition"
              >
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-blue-400 to-indigo-600 text-transparent bg-clip-text">
              Subscribe to our newsletter
            </h2>
            <p className="text-muted-foreground mb-8">
              Get the latest articles, tutorials, and updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto shadow-xl border rounded-2xl p-4 bg-white/90 dark:bg-zinc-900/80">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 rounded-full px-5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
              <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow hover:from-indigo-700 hover:to-blue-600">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

