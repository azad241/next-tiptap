"use client"

import { useState } from "react"
import Tiptap from "@/components/tiptap"

export default function Home() {
  const [content, setContent] = useState(
    "<h1>Welcome to Tiptap Editor</h1><p>This is a rich text editor with all the features you need:</p><ul><li><strong>Text formatting</strong> - Bold, italic, strikethrough, highlight</li><li><strong>Headings</strong> - H1, H2, H3 support</li><li><strong>Lists</strong> - Bullet and numbered lists</li><li><strong>Alignment</strong> - Left, center, right, justify</li><li><strong>Colors</strong> - Predefined and custom color picker</li><li><strong>Links and Images</strong> - Easy insertion</li><li><strong>Tables</strong> - Full table support</li><li><strong>Media</strong> - YouTube embeds</li><li><strong>Advanced</strong> - Subscript, superscript, blockquotes</li></ul><p>Start editing and explore all the features!</p>",
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Tiptap Editor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A rich text editor for content site, blog site and more...
          </p>
        </div>

        {/* Main Editor */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <Tiptap
            content={content}
            onChange={setContent}
            placeholder="Start writing your amazing content here..."
            className="w-full"
          />
        </div>


      </div>
    </div>
  )
}
