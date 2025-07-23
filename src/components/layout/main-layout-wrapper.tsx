"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(5)

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
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isMobile={true} />

      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          notifications={notifications}
        />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
