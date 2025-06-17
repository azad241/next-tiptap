"use client"

import type React from "react"
import type { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  Video,
  Table,
  Plus,
  Trash2,
  Highlighter,
  Subscript,
  Superscript,
  ListIcon,
  ChevronDown,
  FileText,
  RefreshCw,
  Unlink,
  ALargeSmall,
  Link2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import ColorPicker from "./color-picker"
import DragDropUpload from "../s3/drag-and-drop"

interface EditorToolbarProps {
  editor: Editor
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const [linkDialog, setLinkDialog] = useState(false)
  const [imageDialog, setImageDialog] = useState(false)
  const [youtubeDialog, setYoutubeDialog] = useState(false)

  // states for Link
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [linkTarget, setLinkTarget] = useState(false)
  const [linkNofollow, setLinkNofollow] = useState(false)
  const [isEditingLink, setIsEditingLink] = useState(false)

  // states for YouTube 
  const [youtubeUrl, setYoutubeUrl] = useState("")

  // states for Image
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")

  // Check if cursor is on a link and populate form
  useEffect(() => {
    if (linkDialog) {
      const { href, target, rel } = editor.getAttributes("link")
      if (href) {
        setIsEditingLink(true)
        setLinkUrl(href)
        setLinkTarget(target === "_blank")
        setLinkNofollow(rel === "nofollow")
        setLinkText(editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to))
      } else {
        setIsEditingLink(false)
        setLinkUrl("")
        setLinkText("")
        setLinkTarget(false)
        setLinkNofollow(false)
      }
    }
  }, [linkDialog, editor])

  const addOrUpdateLink = () => {
    if (linkUrl) {
      const attributes: any = { href: linkUrl }
      if (linkTarget) attributes.target = "_blank"
      if (linkNofollow) attributes.rel = "nofollow"

      if (isEditingLink) {
        editor.chain().focus().setLink(attributes).run()
      } else if (linkText) {
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${linkUrl}"${linkTarget ? ' target="_blank"' : ""}${linkNofollow ? ' rel="nofollow"' : ""}>${linkText}</a> `,
          )
          .run()
      } else {
        editor.chain().focus().setLink(attributes).run()
      }

      setLinkUrl("")
      setLinkText("")
      setLinkTarget(false)
      setLinkNofollow(false)
      setIsEditingLink(false)
      setLinkDialog(false)
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
    setLinkDialog(false)
    setIsEditingLink(false)
  }

  const addYoutube = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: 640,
        height: 480,
      })
      setYoutubeUrl("")
      setYoutubeDialog(false)
    }
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()

        const img_url = process.env.NEXT_PUBLIC_R2_URL + '/' + data.key

        // Insert image with style attributes
        const styleString =
          "max-width: 100%; border-radius: 0.5rem; margin: 0.5rem auto; display: block; cursor: pointer;"

        editor
          .chain()
          .focus()
          .insertContent({
            type: "customImage",
            attrs: {
              src: img_url,
              alt: file.name,
              style: styleString,
              class: "max-w-full h-auto rounded-lg my-2 mx-auto block cursor-pointer",
            },
          })
          .run()

     
      }

      setImageDialog(false)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  const HandleOnUploadComplete = (data: any) => {
    const mockImageUrl = process.env.NEXT_PUBLIC_R2_URL + '/' + data.key
    const styleString = "max-width: 100%; border-radius: 0.5rem; margin: 0.5rem auto; display: block; cursor: pointer;"

    // Insert image with style
    editor
      .chain().focus().insertContent({
        type: "customImage",
        attrs: {
          src: mockImageUrl,
          alt: "Uploaded image",
          style: styleString,
          class: "max-w-full h-auto rounded-lg my-2 mx-auto block cursor-pointer",
        },
      })
      .run()

    setImageDialog(false)
  }

  const insertImageFromUrl = () => {
    if (!imageUrl) return

    const styleString = "max-width: 100%; border-radius: 0.5rem; margin: 0.5rem auto; display: block; cursor: pointer;"

    editor.chain().focus().insertContent({
        type: "customImage",
        attrs: {
          src: imageUrl,
          alt: imageAlt || "Image",
          style: styleString,
          class: "max-w-full h-auto rounded-lg my-2 mx-auto block cursor-pointer",
        },
      })
      .run()

    setImageUrl("")
    setImageAlt("")
    setImageDialog(false)
  }

  const fetchFiles = () => {
    setLoading(true)
    console.log("Fetching files...")
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b-2 border-gray-200 overflow-x-auto">
      {/* History */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0 shrink-0"
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0 shrink-0"
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Headings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 shrink-0">
            {editor.isActive("heading", { level: 1 }) ? (
              <>
                <Heading1 className="w-4 h-4 mr-1" />
                Heading 1
              </>
            ) : editor.isActive("heading", { level: 2 }) ? (
              <>
                <Heading2 className="w-4 h-4 mr-1" />
                Heading 2
              </>
            ) : editor.isActive("heading", { level: 3 }) ? (
              <>
                <Heading3 className="w-4 h-4 mr-1" />
                Heading 3
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-1" />
                Paragraph
              </>
            )}
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "bg-gray-100" : ""}
          >
            <FileText className="w-4 h-4 mr-2" />
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "bg-gray-100" : ""}
          >
            <Heading1 className="w-4 h-4 mr-2" />
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-gray-100" : ""}
          >
            <Heading2 className="w-4 h-4 mr-2" />
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "bg-gray-100" : ""}
          >
            <Heading3 className="w-4 h-4 mr-2" />
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 p-0 shrink-0 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 p-0 shrink-0 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`h-8 w-8 p-0 shrink-0 ${editor.isActive("strike") ? "bg-gray-200" : ""}`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`h-8 w-8 p-0 shrink-0 ${editor.isActive("code") ? "bg-gray-200" : ""}`}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </Button>

      {/* Colors */}
      <ColorPicker editor={editor} />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-10 p-0 shrink-0" title="Text Alignment">
            {editor.isActive({ textAlign: "center" }) ? (
              <AlignCenter className="w-4 h-4" />
            ) : editor.isActive({ textAlign: "right" }) ? (
              <AlignRight className="w-4 h-4" />
            ) : editor.isActive({ textAlign: "justify" }) ? (
              <AlignJustify className="w-4 h-4" />
            ) : (
              <AlignLeft className="w-4 h-4" />
            )}
            <ChevronDown className="w-2 h-2 -ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={editor.isActive({ textAlign: "left" }) ? "bg-gray-100" : ""}
          >
            <AlignLeft className="w-4 h-4 mr-2" />
            Align Left
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={editor.isActive({ textAlign: "center" }) ? "bg-gray-100" : ""}
          >
            <AlignCenter className="w-4 h-4 mr-2" />
            Align Center
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={editor.isActive({ textAlign: "right" }) ? "bg-gray-100" : ""}
          >
            <AlignRight className="w-4 h-4 mr-2" />
            Align Right
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={editor.isActive({ textAlign: "justify" }) ? "bg-gray-100" : ""}
          >
            <AlignJustify className="w-4 h-4 mr-2" />
            Justify
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Lists Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-10 p-0 shrink-0" title="Lists">
            <ListIcon className="w-4 h-4" />
            <ChevronDown className="w-2 h-2 -ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-gray-100" : ""}
          >
            <List className="w-4 h-4 mr-2" />
            Bullet List
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-gray-100" : ""}
          >
            <ListOrdered className="w-4 h-4 mr-2" />
            Numbered List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`h-8 w-8 p-0 shrink-0 ${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="h-8 w-8 p-0 shrink-0"
        title="Horizontal Rule"
      >
        <Minus className="w-4 h-4" />
      </Button>

      {/* Format Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-10 p-0 shrink-0" title="More Formatting">
            <ALargeSmall className="w-4 h-6" />
            <ChevronDown className="w-2 h-2 -ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive("highlight") ? "bg-gray-100" : ""}
          >
            <Highlighter className="w-4 h-4 mr-2" />
            Highlight
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={editor.isActive("subscript") ? "bg-gray-100" : ""}
          >
            <Subscript className="w-4 h-4 mr-2" />
            Subscript
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={editor.isActive("superscript") ? "bg-gray-100" : ""}
          >
            <Superscript className="w-4 h-4 mr-2" />
            Superscript
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Link Dialog */}
      <Dialog open={linkDialog} onOpenChange={setLinkDialog}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 shrink-0 ${editor.isActive("link") ? "bg-blue-100 text-blue-700" : ""}`}
            title="Insert/Edit Link (Ctrl+K)"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditingLink ? "Edit Link" : "Insert Link"}</DialogTitle>
            <DialogDescription>
              {isEditingLink
                ? "Update the link properties below."
                : "Add a link to your content. You can link to external websites or internal pages."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            {!isEditingLink && (
              <div className="space-y-2">
                <Label htmlFor="link-text">Link Text (optional)</Label>
                <Input
                  id="link-text"
                  placeholder="Leave empty to use selected text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="link-target"
                  checked={linkTarget}
                  onCheckedChange={(checked) => setLinkTarget(checked as boolean)}
                />
                <Label htmlFor="link-target">Open in new tab (target="_blank")</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="link-nofollow"
                  checked={linkNofollow}
                  onCheckedChange={(checked) => setLinkNofollow(checked as boolean)}
                />
                <Label htmlFor="link-nofollow">Add nofollow (rel="nofollow")</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            {isEditingLink && (
              <Button variant="outline" onClick={removeLink} className="mr-auto">
                <Unlink className="w-4 h-4 mr-1" />
                Remove Link
              </Button>
            )}
            <Button variant="outline" onClick={() => setLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addOrUpdateLink} disabled={!linkUrl}>
              {isEditingLink ? "Update Link" : "Insert Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={imageDialog} onOpenChange={setImageDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" title="Insert Image">
            <ImageIcon className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>Upload an image or insert from URL.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-4">
                    <DragDropUpload onUploadComplete={HandleOnUploadComplete} />
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor="file-upload">Or upload manually</Label>
                        <Input
                          id="file-upload"
                          type="file"
                          onChange={handleUpload}
                          disabled={uploading}
                          className="mt-1"
                          multiple
                          accept="image/*"
                        />
                      </div>
                      <Button onClick={() => fetchFiles()} disabled={loading} variant="outline" size="sm">
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                      </Button>
                    </div>

                    {uploading && <div className="text-sm text-muted-foreground">Uploading file...</div>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL *</Label>
                  <Input
                    id="image-url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-alt">Alt Text (for accessibility)</Label>
                  <Input
                    id="image-alt"
                    placeholder="Describe this image"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                  />
                </div>
                <Button onClick={insertImageFromUrl} disabled={!imageUrl} className="w-full">
                  <Link2 className="w-4 h-4 mr-2" />
                  Insert Image from URL
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* YouTube Dialog */}
      <Dialog open={youtubeDialog} onOpenChange={setYoutubeDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" title="Insert YouTube Video">
            <Video className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert YouTube Video</DialogTitle>
            <DialogDescription>Paste a YouTube URL to embed a video in your content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube URL *</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-600">
              Supported formats:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                <li>https://youtu.be/VIDEO_ID</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setYoutubeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addYoutube} disabled={!youtubeUrl}>
              Insert Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Button */}
      <Button variant="ghost" size="sm" onClick={insertTable} className="h-8 w-8 p-0 shrink-0" title="Insert Table">
        <Table className="w-4 h-4" />
      </Button>

      {/* Table Controls (when table is active) */}
      {editor.isActive("table") && (
        <>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 bg-blue-50 text-blue-700 shrink-0">
                <Table className="w-4 h-4 mr-1" />
                Table
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Column Before
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Column After
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Row Before
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Row After
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Table
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}

export default EditorToolbar
