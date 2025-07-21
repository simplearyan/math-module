"use client";

import React from 'react'
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ProjectsTab } from './tabs/projects-tab';
import { LearnTab } from './tabs/learn-tab';
import Editor from './Editor';


export const App = () => {
  const [notifications, setNotifications] = useState(5);
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 30% 70%, rgba(233, 30, 99, 0.5) 0%, rgba(81, 45, 168, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.5) 0%, rgba(32, 119, 188, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isMobile={true}
      />

      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:pl-64" : "md:pl-0"
        )}
      >
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          notifications={notifications}
        />

        <main className="flex-1 p-4 md:p-6">
          <Tabs
            defaultValue="home"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TabsList className="grid w-full max-w-[600px] grid-cols-5 rounded-2xl p-1">
                <TabsTrigger
                  value="home"
                  className="rounded-xl data-[state=active]:rounded-xl"
                >
                  Home
                </TabsTrigger>
                <TabsTrigger
                  value="apps"
                  className="rounded-xl data-[state=active]:rounded-xl"
                >
                  Apps
                </TabsTrigger>
                <TabsTrigger
                  value="files"
                  className="rounded-xl data-[state=active]:rounded-xl"
                >
                  Files
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="rounded-xl data-[state=active]:rounded-xl"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="learn"
                  className="rounded-xl data-[state=active]:rounded-xl"
                >
                  Learn
                </TabsTrigger>
              </TabsList>
              <div className="hidden md:flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-2xl bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Install App
                </Button>
                <Button className="rounded-2xl">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="home" className="mt-0">
                {/* <HomeTab /> */}
              </TabsContent>
              <TabsContent value="apps" className="mt-0">
                {/* <AppsTab /> */}
                <Editor/>
              </TabsContent>
              <TabsContent value="files" className="mt-0">
                {/* <FilesTab /> */}
              </TabsContent>
              <TabsContent value="projects" className="mt-0">
                <ProjectsTab />
              </TabsContent>
              <TabsContent value="learn" className="mt-0">
                <LearnTab />
              </TabsContent>
            </motion.div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
