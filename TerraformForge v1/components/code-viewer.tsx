"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface CodeViewerProps {
  files: { name: string; content: string }[]
}

export default function CodeViewer({ files }: CodeViewerProps) {
  const { toast } = useToast()
  const [activeFile, setActiveFile] = useState<string>(files[0]?.name || "")
  const [copiedFile, setCopiedFile] = useState<string | null>(null)

  const copyToClipboard = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content)
    setCopiedFile(fileName)
    toast({
      title: "Copied to clipboard",
      description: `${fileName} has been copied to your clipboard.`,
    })

    setTimeout(() => {
      setCopiedFile(null)
    }, 2000)
  }

  if (files.length === 0) {
    return <p>No files to display.</p>
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
      <Tabs value={activeFile} onValueChange={setActiveFile} className="w-full">
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2 overflow-x-auto">
          <TabsList className="h-9 bg-transparent inline-flex">
            {files.map((file) => (
              <TabsTrigger
                key={file.name}
                value={file.name}
                className="px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-sm"
              >
                {file.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {files.map((file) => (
          <TabsContent key={file.name} value={file.name} className="m-0 relative">
            <div className="absolute right-2 top-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(file.content, file.name)}
                title="Copy to clipboard"
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {copiedFile === file.name ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="p-4 overflow-auto text-sm font-mono bg-white dark:bg-slate-950 rounded-b-lg">
              <code className="text-slate-800 dark:text-slate-300">{file.content}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}
