"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Paragraph from "@tiptap/extension-paragraph"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Blockquote from "@tiptap/extension-blockquote"
import Youtube from "@tiptap/extension-youtube"

import EditorToolbar from "./editor-toolbar"
import EditorFooter from "./editor-footer"
import HtmlViewer from "./html-viewer"



interface TiptapProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
}

const Tiptap = ({
  content = "<h1>Welcome to Tiptap Editor</h1><p>This rich text editor includes all the features you need for professional content creation. Try editing this content directly!</p><h2>Key Features</h2><ul><li><strong>Rich formatting</strong> with <em>multiple</em> <mark>text styles</mark></li><li>Beautiful <span style='color: #3b82f6'>colored text</span> and <span style='background-color: #fef3c7'>background colors</span></li><li>Professional tables, lists, and media embedding</li></ul><blockquote><p>\"The best editor for modern web applications\" - Start editing and explore all features!</p></blockquote><p>Try the toolbar dropdowns above for organized access to all formatting options.</p>",
  onChange,
  placeholder = "Start writing...",
  className = "",
}: TiptapProps) => {
  const [showHtmlViewer, setShowHtmlViewer] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside ml-6 my-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-outside ml-6 my-2",
          },
        },
        heading: {
          HTMLAttributes: {
            class: "font-bold my-1",
          },
        },
        blockquote: false, // We'll use the dedicated extension
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: "my-1",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "px-1 rounded",
        },
      }),
      TextStyle,
      Color,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-300 my-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 bg-gray-50 font-bold p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-2",
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-2",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600",
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: "my-4 rounded-lg mx-auto w-[98%] h-[220px] md:w-auto md:h-auto",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] max-h-[500px] overflow-y-auto p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto",
        placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
      // console.log(html)
    },
  })

  if (!editor) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Card className="shadow-lg border-0 bg-white">
        <div className="border-b border-gray-200">
          <EditorToolbar editor={editor} />
        </div>

        <div className="relative bg-white">
          {showHtmlViewer ? (
            <div className="min-h-[300px] p-4">
              <HtmlViewer content={editor.getHTML()} />
            </div>
          ) : (
            <EditorContent editor={editor} className="min-h-[300px]" />
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50">
          <EditorFooter
            editor={editor}
            onToggleHtml={() => setShowHtmlViewer(!showHtmlViewer)}
            showHtml={showHtmlViewer}
          />
        </div>
      </Card>
    </div>
  )
}

export default Tiptap
