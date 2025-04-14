"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Menu, X } from "lucide-react"
import { signOut } from "@/lib/firebase/auth-client"
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const router = useRouter()
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">ARM to Terraform</span>
        </Link>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/history" className="text-sm hover:underline">
            Conversion History
          </Link>
          <Link href="/dashboard" className="text-sm hover:underline">
            Dashboard
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background p-6 md:hidden">
            <nav className="flex flex-col space-y-6">
              <Link href="/history" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Conversion History
              </Link>
              <Link href="/dashboard" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <Link href="/profile" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Profile
              </Link>
              <Link href="/settings" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Settings
              </Link>
              <Button onClick={handleSignOut} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
