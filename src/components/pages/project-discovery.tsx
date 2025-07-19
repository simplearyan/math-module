"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, TrendingUp, GitFork, ExternalLink, Menu, Edit, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const projectTemplates = [
  {
    id: 1,
    title: "Cyberpunk Dashboard Design",
    description: "Futuristic dashboard with neon aesthetics",
    image: "/placeholder.svg?height=300&width=400&text=Cyberpunk+Dashboard",
    forks: "4.5K",
    category: "Dashboard",
    author: "designstudio",
    trending: true,
  },
  {
    id: 2,
    title: "Supabase Starter",
    description: "Full-stack app with authentication",
    image: "/placeholder.svg?height=300&width=400&text=Supabase+Starter",
    forks: "7.7K",
    category: "Starter",
    author: "supabase",
    trending: true,
  },
  {
    id: 3,
    title: "SaaS Landing Page",
    description: "Modern landing page for SaaS products",
    image: "/placeholder.svg?height=300&width=400&text=SaaS+Landing",
    forks: "5.7K",
    category: "Landing",
    author: "webflow",
    trending: false,
  },
  {
    id: 4,
    title: "Portfolio Template",
    description: "Clean portfolio for developers",
    image: "/placeholder.svg?height=300&width=400&text=Portfolio+Template",
    forks: "3.2K",
    category: "Portfolio",
    author: "devfolio",
    trending: false,
  },
  {
    id: 5,
    title: "E-commerce Dashboard",
    description: "Analytics dashboard for online stores",
    image: "/placeholder.svg?height=300&width=400&text=Ecommerce+Dashboard",
    forks: "6.1K",
    category: "Dashboard",
    author: "shopify",
    trending: true,
  },
  {
    id: 6,
    title: "Blog Platform",
    description: "Modern blog with CMS integration",
    image: "/placeholder.svg?height=300&width=400&text=Blog+Platform",
    forks: "2.8K",
    category: "Blog",
    author: "contentful",
    trending: false,
  },
  {
    id: 7,
    title: "Admin Panel Pro",
    description: "Professional admin interface",
    image: "/placeholder.svg?height=300&width=400&text=Admin+Panel",
    forks: "8.3K",
    category: "Admin",
    author: "adminpro",
    trending: true,
  },
  {
    id: 8,
    title: "Mobile App UI Kit",
    description: "Complete mobile app design system",
    image: "/placeholder.svg?height=300&width=400&text=Mobile+UI+Kit",
    forks: "4.9K",
    category: "Mobile",
    author: "uikit",
    trending: false,
  },
]

const categories = ["All", "Apps", "Games", "Sites", "Components", "Blocks", "Starters"]

export function ProjectDiscovery() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("trending")

  const filteredProjects = projectTemplates.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || project.category.toLowerCase() === activeCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "trending") {
      return b.trending ? 1 : -1
    }
    if (sortBy === "forks") {
      return Number.parseFloat(b.forks) - Number.parseFloat(a.forks)
    }
    return a.title.localeCompare(b.title)
  })

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile Header */}
      {/* <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold">Community</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <ProfileDropdown />
          </div>
        </div> */}

        {/* Mobile Tabs */}
        {/* <div className="px-4 pb-4">
          <Tabs value="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-lg">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div> */}

      {/* Desktop Header */}
      {/* <div className="hidden md:block sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-semibold">Community</h1>
              <Tabs value="discover" className="w-auto">
                <TabsList className="rounded-lg">
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                  <TabsTrigger value="submissions">Submissions</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Palette className="h-4 w-4" />
              </Button>
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="relative overflow-hidden">
        {/* Background Pattern - Theme Aware */}
        <div className="absolute inset-0 " />

        {/* Tool Icons - Responsive */}
        <div className="flex justify-center gap-2 md:gap-4 pt-6 md:pt-8 mb-6 md:mb-8 px-4">
          {["💻", "🎨", "⚡", "🚀", "🔧"].map((icon, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-8 h-8 md:w-12 md:h-12 bg-card border rounded-lg flex items-center justify-center text-sm md:text-xl"
            >
              {icon}
            </motion.div>
          ))}
        </div>

        {/* Main Title - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-4 mb-8 md:mb-12"
        >
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
            Discover the best apps, components
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
            and starters from the community.
          </h2>

          {/* Search Bar - Responsive */}
          <div className="max-w-xl md:max-w-2xl mx-auto mb-6 md:mb-8">
            <div className="relative">
              <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-card border rounded-xl focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Category Tabs - Responsive */}
          <div className="flex justify-center mb-6 md:mb-8 px-4">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="bg-card  rounded-xl p-1 grid grid-cols-3 md:grid-cols-7 gap-1 w-full max-w-4xl">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-2 md:px-4 py-2"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-16">
        {/* Sort Dropdown - Responsive */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="md:hidden">
            <h3 className="font-semibold text-lg">Templates</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-card border">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Trending</span>
                <span className="md:hidden">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border">
              <DropdownMenuItem onClick={() => setSortBy("trending")}>Trending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("forks")}>Most Forked</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Projects Grid - Responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {sortedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="bg-card border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.trending && (
                    <Badge className="absolute top-2 md:top-3 right-2 md:right-3 bg-orange-500 hover:bg-orange-600 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span className="hidden md:inline">Trending</span>
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <Button
                    size="icon"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground ml-2 shrink-0">
                      {project.category}
                    </Badge>
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {project.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{project.author}</span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GitFork className="h-3 w-3" />
                      <span className="text-xs">{project.forks}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        <div className="text-center mt-8 md:mt-12">
          <Button variant="outline" className="bg-card border">
            Load More Templates
          </Button>
        </div>
      </div>
    </div>
  )
}
