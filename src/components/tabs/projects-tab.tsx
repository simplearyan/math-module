"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCard } from "@/components/cards/project-card"
import { ProjectDiscovery } from "@/components/pages/project-discovery"
import { projects } from "@/data/sample-data"

export function ProjectsTab() {
  const [activeView, setActiveView] = useState("my-projects")

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 rounded-2xl p-1">
            <TabsTrigger value="my-projects" className="rounded-xl">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="discover" className="rounded-xl">
              Discover
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="my-projects" className="mt-0">
          <div className="space-y-6">
            {/* Hero Section */}
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Your Projects</h2>
                  <p className="max-w-[600px] text-white/80">
                    Manage your active projects and explore project templates to kickstart your next idea.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button className="rounded-2xl bg-white text-purple-700 hover:bg-white/90">New Project</Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10"
                    >
                      Import Project
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter Buttons */}
            <section className="flex flex-wrap gap-3">
              <Button variant="default" className="rounded-2xl">
                All Projects
              </Button>
              <Button variant="outline" className="rounded-2xl bg-transparent">
                Active
              </Button>
              <Button variant="outline" className="rounded-2xl bg-transparent">
                Completed
              </Button>
              <Button variant="outline" className="rounded-2xl bg-transparent">
                Archived
              </Button>
            </section>

            {/* Active Projects Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Active Projects</h3>
                <Button variant="ghost" className="rounded-2xl">
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.name} project={project} />
                ))}
              </div>
            </section>

            {/* Project Templates */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Project Templates</h3>
                <Button variant="ghost" className="rounded-2xl" onClick={() => setActiveView("discover")}>
                  Browse All
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "SaaS Starter", description: "Complete SaaS application template", category: "Web App" },
                  { name: "E-commerce Store", description: "Modern online store template", category: "E-commerce" },
                  { name: "Portfolio Site", description: "Professional portfolio template", category: "Portfolio" },
                ].map((template) => (
                  <div key={template.name} className="rounded-3xl border p-6 hover:border-primary/50 transition-colors">
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4" />
                    <h4 className="font-semibold mb-2">{template.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-muted px-2 py-1 rounded-xl">{template.category}</span>
                      <Button size="sm" className="rounded-xl">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="discover" className="mt-0">
          <ProjectDiscovery />
        </TabsContent>
      </Tabs>
    </div>
  )
}
