"use client"

import { tutorials } from "@/data/sample-data"
import { Award, Clock, Eye, Play } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function LearnTab() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Unlock Your Potential</h2>
        <p className="max-w-xl mx-auto mb-6 text-white/90">
          Explore tutorials, courses and paths crafted to boost your creative skills.
        </p>
        <Button className="rounded-2xl bg-white text-emerald-700 hover:bg-white/90">Get Started</Button>
      </section>

      {/* Featured tutorials */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Featured Tutorials</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tutorials.slice(0, 3).map((tut) => (
            <motion.div key={tut.title} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
              <Card className="overflow-hidden rounded-3xl">
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="icon" variant="secondary" className="h-14 w-14 rounded-full">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">{tut.category}</Badge>
                    <h4 className="mt-2 text-lg font-medium">{tut.title}</h4>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{tut.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{tut.instructor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{tut.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {tut.duration}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <Badge variant="outline" className="rounded-xl">
                    {tut.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {tut.views} views
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Learning path teaser */}
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold">Learning Paths</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { title: "UI/UX Fundamentals", level: "Beginner", progress: 30 },
            { title: "Digital Illustration", level: "Intermediate", progress: 0 },
            { title: "Motion Graphics", level: "Advanced", progress: 0 },
          ].map((path) => (
            <Card key={path.title} className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    className={`rounded-xl ${
                      path.level === "Beginner"
                        ? "bg-blue-500"
                        : path.level === "Intermediate"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  >
                    {path.level}
                  </Badge>
                  <Award className="h-5 w-5 text-amber-400" />
                </div>
                <h4 className="text-lg font-medium">{path.title}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{path.progress}% completed</span>
                  </div>
                  <Progress value={path.progress} className="h-2 rounded-xl" />
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="secondary" className="w-full rounded-2xl">
                  {path.progress ? "Continue Learning" : "Start Learning"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
