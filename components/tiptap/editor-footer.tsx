"use client"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Code, Eye, EyeOff } from "lucide-react"
interface EditorFooterProps {
  editor: Editor
  onToggleHtml: () => void
  showHtml: boolean
}

const EditorFooter = ({ editor, onToggleHtml, showHtml }: EditorFooterProps) => {


  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 bg-gray-50">
      <div className="flex items-center gap-4">
        <span>Words: {editor.getText().trim().split(/\s+/).length}</span>
        <span>Characters: {editor.getText().length}</span>
        <span>Characters (with spaces): {editor.getHTML().replace(/<[^>]*>/g, "").length}</span>
      </div>

      <Button variant="ghost" size="sm" onClick={onToggleHtml} className="h-7 px-2">
        {/* <Code className="w-4 h-4 mr-1" /> */}
        {showHtml ? (
          <>
            <EyeOff className="w-4 h-4 mr-1" />
            Hide HTML
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-1" />
            View HTML
          </>
        )}
      </Button>
    </div>
  )
}

export default EditorFooter
