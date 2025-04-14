"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload, Code, Download, RefreshCw } from "lucide-react"
import FileUpload from "@/components/file-upload"
import CodeViewer from "@/components/code-viewer"
import { useToast } from "@/hooks/use-toast"
import type { CloudProvider } from "@/lib/types"
import { localConvertToTerraform } from "@/lib/api/local-conversion"

export default function ConversionTool() {
  const { toast } = useToast()
  const [cloudProvider, setCloudProvider] = useState<CloudProvider>("azure")
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [resultFiles, setResultFiles] = useState<{ name: string; content: string }[]>([])
  const [activeTab, setActiveTab] = useState<string>("upload")

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile)
    setFileName(selectedFile.name)
    setActiveTab("convert")
  }

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an ARM or Bicep file first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsConverting(true)

      // Use the local conversion function
      const convertedFiles = await localConvertToTerraform(file, cloudProvider)

      setResultFiles(convertedFiles)
      setActiveTab("result")
      toast({
        title: "Conversion successful!",
        description: "Your template has been converted to Terraform code.",
      })
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (resultFiles.length === 0) return

    // Create a zip file with all the terraform files
    import("jszip").then(({ default: JSZip }) => {
      const zip = new JSZip()

      // Add each file to the zip
      resultFiles.forEach((file) => {
        zip.file(file.name, file.content)
      })

      // Generate the zip file
      zip.generateAsync({ type: "blob" }).then((content) => {
        // Create a download link
        const url = window.URL.createObjectURL(content)
        const a = document.createElement("a")
        a.href = url
        a.download = `terraform-${new Date().getTime()}.zip`
        document.body.appendChild(a)
        a.click()

        // Clean up
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
    })
  }

  const handleReset = () => {
    setFile(null)
    setFileName("")
    setResultFiles([])
    setActiveTab("upload")
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Cloud Template Converter</h2>
        <p className="text-slate-600 dark:text-slate-400">Convert your cloud templates to Terraform code in seconds</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Target Cloud Provider
              </label>
              <Select value={cloudProvider} onValueChange={(value: CloudProvider) => setCloudProvider(value)}>
                <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="azure">Azure</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                  <SelectItem value="gcp">Google Cloud (GCP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {fileName && (
              <div className="mt-2 md:mt-0 w-full md:w-auto text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                <span className="font-semibold">Selected:</span> {fileName}
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-800 p-1">
              <TabsTrigger
                value="upload"
                disabled={isConverting}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="convert"
                disabled={!file || isConverting}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Convert
              </TabsTrigger>
              <TabsTrigger
                value="result"
                disabled={resultFiles.length === 0 || isConverting}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
              >
                <Code className="mr-2 h-4 w-4" />
                Result
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <FileUpload onFileSelected={handleFileSelected} />
            </TabsContent>

            <TabsContent value="convert" className="mt-0">
              <div className="text-center py-12 px-4">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-900/20">
                  <RefreshCw className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-medium mb-4">Ready to Convert</h3>
                <p className="mb-6 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Your file is ready to be converted to Terraform code for {cloudProvider.toUpperCase()}.
                </p>
                <Button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert to Terraform"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="result" className="mt-0">
              {resultFiles.length > 0 && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-medium mb-2">Conversion Result</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Generated {resultFiles.length} Terraform files based on your template.
                    </p>
                  </div>

                  <CodeViewer files={resultFiles} />

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                    <Button variant="outline" onClick={handleReset} className="border-slate-200 dark:border-slate-800">
                      Start Over
                    </Button>
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Terraform Files
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
