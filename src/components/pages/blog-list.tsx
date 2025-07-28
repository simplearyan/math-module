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

  // Extract unique categories
  //   const categories = ["All", ...Array.from(new Set(blogPosts.map((post) => post.category)))]
  // const categories = [
  //   "All",
  //   ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean)))
  // ]
  const allCategories = posts.flatMap((post) => post.category || []); // FlatMap to handle string[]
  const uniqueCategories = Array.from(new Set(allCategories));
  const categories: CategoryType[] = ["All", ...uniqueCategories];

  // console.log(posts.map((post) => post.category).filter(Boolean));

  // Filter posts based on search query and category
  const filteredPosts = posts.filter((post) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Ensure post.tags is always an array for consistent checking
    const postTags = post.tags || [];
    // Check if any of the post's tags include the search query
    const matchesTag = postTags.some((tag) =>
      tag.toLowerCase().includes(lowerCaseSearchQuery)
    );

    // If category is missing, treat as "Uncategorized"
    // const postCategory = post.category || "Category";
    // const matchesCategory =
    //   activeCategory === "All" || postCategory === activeCategory;

    const postCategories = post.category || []; // Ensure it's an array
    const matchesCategory =
      activeCategory === "All" || postCategories.includes(activeCategory); // Check if the activeCategory is in the post's category array

    return (matchesSearch || matchesTag) && matchesCategory;
  });

  // Get featured posts
  //   const featuredPosts = blogPosts.filter((post) => post.featured)
  const featuredPosts = posts.filter((post) => !!post.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Designali Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground mb-8"
            >
              Insights, tutorials, and inspiration for designers and creative
              professionals
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
                className="w-full pl-12 pr-4 py-6 text-base bg-card border rounded-xl focus:ring-2 focus:ring-primary transition-all"
              />
            </motion.div>

            {/* Category Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center"
            >
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                {/* <TabsList className="bg-card border rounded-xl p-1 grid grid-cols-3 md:grid-cols-5 gap-1 w-full">
                    {categories.map((category) => (
                          <TabsTrigger
                            key={category}
                            value={category}
                            className="text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-3 md:px-4 py-2 md:py-3 transition-all"
                          >
                            {category}
                          </TabsTrigger>
                        ))}
                </TabsList> */}
                <TabsList
                  className="
          flex justify-center flex-wrap gap-2 p-1
          bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner
          md:flex-nowrap md:justify-start
        "
                  aria-label="Filter categories"
                >
                  {categories.map((category: CategoryType) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="
              text-sm md:text-base px-4 py-2 rounded-lg
              font-medium transition-all duration-200 ease-in-out
              text-gray-700 dark:text-gray-300
              hover:bg-gray-200 dark:hover:bg-gray-700

              data-[state=active]:bg-blue-600 data-[state=active]:text-white
              data-[state=active]:shadow-md
              data-[state=active]:hover:bg-blue-700
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
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 group">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          // src={post.image || "/placeholder.svg"}
                          src={
                            "https://raw.githubusercontent.com/simplearyan/stick-hero/main/assets/Screenshot.png"
                          }
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge className="mb-3">
                          {post.category && post.category.length > 0
                            ? post.category[0]
                            : "Uncategorized"}
                        </Badge>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img
                                src={
                                  typeof post.author === "object" &&
                                  post.author?.avatar
                                    ? post.author.avatar
                                    : "/https://github.com/simplearyan.png"
                                }
                                alt={
                                  typeof post.author === "object" &&
                                  post.author?.name
                                    ? post.author.name
                                    : typeof post.author === "string"
                                    ? post.author
                                    : "Aryan"
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm">
                              {typeof post.author === "object" &&
                              post.author?.name
                                ? post.author.name
                                : typeof post.author === "string"
                                ? post.author
                                : "Aryan"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {post.publishedAt ? (
                                  <time dateTime={post.publishedAt.toString()}>
                                    {new Date(
                                      post.publishedAt
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </time>
                                ) : (
                                  <span className="italic text-muted-foreground">
                                    {post.date}
                                  </span>
                                )}
                              </span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 group">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={
                            post.image ||
                            "https://images.unsplash.com/photo-1749248120469-c41bf8471a48?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          }
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge className="mb-3">
                          {
                            post.category && post.category.length > 0
                              ? post.category // If there's an array with at least one element, display the first element
                              : "Uncategorized" // Otherwise, display "Uncategorized"
                          }
                        </Badge>
                        <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <img
                                src={
                                  typeof post.author === "object" &&
                                  post.author?.avatar
                                    ? post.author.avatar
                                    : "https://github.com/simplearyan.png"
                                }
                                alt={
                                  typeof post.author === "object" &&
                                  post.author?.name
                                    ? post.author.name
                                    : typeof post.author === "string"
                                    ? post.author
                                    : "Aryan"
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm">
                              {typeof post.author === "object" &&
                              post.author?.name
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
                className="rounded-full px-8 py-6 text-base bg-transparent"
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
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Subscribe to our newsletter
            </h2>
            <p className="text-muted-foreground mb-8">
              Get the latest articles, tutorials, and updates delivered to your
              inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 rounded-full p-5"
              />
              <Button className="h-12 px-8 rounded-full">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
