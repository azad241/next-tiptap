"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Paragraph from "@tiptap/extension-paragraph"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table"
import Blockquote from "@tiptap/extension-blockquote"
import Youtube from "@tiptap/extension-youtube"
import { CustomImage } from "./custom-image"
import EditorToolbar from "./editor-toolbar"
import EditorFooter from "./editor-footer"
import HtmlViewer from "./html-viewer"
import ImageSizeDialog from "./image-size-dialog"

interface TiptapProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
}


export default function Tiptap({ content, onChange, placeholder = "Start writing...", className, }: TiptapProps) {
  const [showHtmlViewer, setShowHtmlViewer] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link : {
        openOnClick: false,
        enableClickSelection: true,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
          rel: null,
          target: null,
        },
      },
        bulletList: {
          HTMLAttributes: { class: "list-disc list-outside ml-6 my-2" },
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
        blockquote: false,
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
      TableRow,
      
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 bg-gray-50 font-bold p-2",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-300 my-4 mx-auto",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-2",
        },
      }),
      // Use CustomImage instead of regular Image
      CustomImage.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-2 mx-auto block cursor-pointer",
        },
        allowBase64: true,
        inline: false,
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
          class: "my-4 rounded-lg mx-auto w-[98%] h-[220px] md:w-[640px] md:h-[480px]",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "min-h-[300px] max-h-[500px] overflow-y-auto p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto relative",
        placeholder,
      },
      //remove link selectio after typing space or any char
      handleKeyDown: (view, event) => {
        const { state, dispatch } = view
        const { selection } = state

        if (event.key === " " || (event.key.length === 1 && !event.ctrlKey && !event.metaKey)) {
          const $pos = selection.$from
          const linkMark = $pos.marks().find((mark) => mark.type.name === "link")

          if (linkMark && $pos.parentOffset === $pos.parent.content.size) {
            const tr = state.tr //transition
            tr.removeStoredMark(linkMark.type)
            dispatch(tr)
          }
        }

        return false
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
      // console.log("HTML:", html)
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

        <div className="relative bg-white overflow-visible">
          {showHtmlViewer ? (
            <div className="min-h-[300px] p-4">
              <HtmlViewer content={editor.getHTML()} />
            </div>
          ) : (
            <div className="relative">
              <EditorContent editor={editor} className="min-h-[300px]" />
              <ImageSizeDialog editor={editor} />
            </div>
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
