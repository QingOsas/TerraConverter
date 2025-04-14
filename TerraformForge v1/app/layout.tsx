import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TerraformForge",
  description: "Convert cloud templates to Terraform code with ease",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-slate-50 dark:bg-slate-950")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-800">
            <div className="container flex h-16 items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  T
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
                  TerraformForge
                </span>
              </div>
            </div>
          </header>
          <div className="min-h-screen">{children}</div>
          <footer className="border-t py-6 md:py-0 dark:border-slate-800">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                &copy; {new Date().getFullYear()} TerraformForge. All rights reserved.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Convert cloud templates to Terraform with confidence
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'