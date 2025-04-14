import ConversionTool from "@/components/conversion-tool"

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="w-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 py-16 md:py-24">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
              TerraformForge
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-8">
            Transform your cloud templates into production-ready Terraform code with a single click
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href="#converter"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-teal-500 to-emerald-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-gradient-to-r hover:from-teal-600 hover:to-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500"
            >
              Start Converting
            </a>
            <a
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-50 dark:focus-visible:ring-slate-800"
            >
              Learn More
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-300 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-upload-cloud"
                >
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Upload</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Upload your ARM or Bicep files with our intuitive interface
              </p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-settings"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Convert</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Transform your templates to Terraform for any cloud provider
              </p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-300 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-download"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Download</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Get production-ready Terraform code with best practices
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="converter" className="container py-16">
        <ConversionTool />
      </div>
    </main>
  )
}
