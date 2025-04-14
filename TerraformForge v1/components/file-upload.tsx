"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Upload, File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onFileSelected: (file: File) => void
}

export default function FileUpload({ onFileSelected }: FileUploadProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file extension
    const validExtensions = [".json", ".bicep"]
    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (!validExtensions.includes(extension)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a valid ARM JSON or Bicep file.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        onFileSelected(file)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        onFileSelected(file)
      }
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Card
      className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
          : "border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-900/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json,.bicep" />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50 mb-6">
        <Upload className="h-8 w-8 text-teal-600 dark:text-teal-400" />
      </div>
      <h3 className="text-xl font-medium mb-3">Upload Template File</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
        Drag and drop your ARM template (JSON) or Bicep file here, or click to browse
      </p>
      <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">
        <File className="mr-2 h-4 w-4" />
        Accepted formats: .json, .bicep
      </div>
    </Card>
  )
}
