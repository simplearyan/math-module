"use client"

import { Bell, Cloud, Menu, MessageSquare, PanelLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onToggleMobileMenu: () => void
  notifications: number
}

export function Header({ sidebarOpen, onToggleSidebar, onToggleMobileMenu, notifications }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleMobileMenu}>
        <Menu className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="hidden md:flex" onClick={onToggleSidebar}>
        <PanelLeft className="h-5 w-5" />
      </Button>
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-semibold">Math Gird</h1>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl">
                  <Cloud className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cloud Storage</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Messages</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {notifications}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Avatar className="h-9 w-9 border-2 border-primary">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
