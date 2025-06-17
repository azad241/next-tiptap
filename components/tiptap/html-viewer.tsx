"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface HtmlViewerProps {
  content: string
}
const formatHtml = (html: string) => {
  return html.replace(/></g, ">\n<").replace(/^\s*\n/gm, "")
}

const HtmlViewer = ({ content }: HtmlViewerProps) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">HTML Source Code</h3>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8">
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <Textarea
        value={formatHtml(content)}
        readOnly
        className="min-h-[200px] max-h-[400px] font-mono text-sm bg-gray-50 resize-none"
        placeholder="HTML content will appear here..."
      />
    </div>
  )
}

export default HtmlViewer
