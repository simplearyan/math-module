"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { User, Settings, CreditCard, FileText, Users, Wallet, LogOut, Monitor, Sun, Moon, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileDropdownProps {
  user?: {
    name: string
    email: string
    avatar?: string
    credits: number
    plan: string
  }
}

export function ProfileDropdown({
  user = {
    name: "John Doe",
    email: "xartistyt@gmail.com",
    credits: 2.75,
    plan: "Free",
  },
}: ProfileDropdownProps) {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("English")

  const menuItems = [
    { icon: User, label: "Profile", shortcut: "" },
    { icon: Settings, label: "Settings", shortcut: "" },
    { icon: CreditCard, label: "Pricing", shortcut: "" },
    { icon: FileText, label: "Documentation", shortcut: "" },
    { icon: Users, label: "Community Forum", shortcut: "" },
  ]

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
        {/* User Info Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar || "/placeholder.svg?height=48&width=48"} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.label} className="flex items-center gap-3 p-3 rounded-lg">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* Credit Balance */}
        {/* <div className="p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-medium">Credit Balance</span>
            </div>
            <Badge variant="secondary">{user.credits}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Monthly credits</p>
          <Button size="sm" className="w-full rounded-lg">
            Upgrade your plan to buy more credits. Upgrade plan
          </Button>
        </div> */}

        {/* <DropdownMenuSeparator /> */}

        {/* Preferences */}
        <div className="p-2">
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3">Preferences</DropdownMenuLabel>

          {/* Theme Selector */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-3 p-3 rounded-lg">
              <Monitor className="h-4 w-4" />
              <span>Theme</span>
              <div className="ml-auto flex gap-1">
                {themeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`w-3 h-3 rounded-full border ${theme === option.value ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {themeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className="flex items-center gap-3"
                >
                  <option.icon className="h-4 w-4" />
                  <span>{option.label}</span>
                  {theme === option.value && <div className="ml-auto w-2 h-2 bg-primary rounded-full" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Language Selector */}
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <Globe className="h-4 w-4" />
            <span className="flex-1">Language</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-24 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <div className="p-2">
          <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg text-red-600 focus:text-red-600">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
