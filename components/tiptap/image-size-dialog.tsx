"use client"

import { useState, useEffect } from "react"
import type { Editor } from "@tiptap/react"
import { X, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface ImageSizeDialogProps {
  editor: Editor
}

const ImageSizeDialog = ({ editor }: ImageSizeDialogProps) => {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
  const [customWidth, setCustomWidth] = useState<string>("")
  const [altText, setAltText] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [imagePos, setImagePos] = useState(-1)

  // Handle image selection
  useEffect(() => {
    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement

      if (target.tagName === "IMG") {
        event.stopPropagation()
        const imgElement = target as HTMLImageElement
        setSelectedImage(imgElement)

        // Find image position in the document
        const { state } = editor
        let pos = -1
        let currentAlt = ""

        state.doc.descendants((node, nodePos) => {
          if (
            (node.type.name === "customImage" || node.type.name === "image") &&
            node.attrs?.src === imgElement.getAttribute("src")
          ) {
            pos = nodePos
            currentAlt = node.attrs?.alt || ""
            return false
          }
        })

        setImagePos(pos)
        setAltText(currentAlt)

        // Set initial width value
        const currentWidth = imgElement.style.width || imgElement.width.toString() + "px"
        setCustomWidth(currentWidth.replace("px", ""))

        // Open the popover
        setIsOpen(true)
      } else if (target.closest(".image-size-dialog") === null) {
        // Close if clicking outside the dialog and not on an image
        setIsOpen(false)
      }
    }

    const editorElement = editor.view.dom
    editorElement.addEventListener("click", handleClick, true)

    return () => {
      editorElement.removeEventListener("click", handleClick, true)
    }
  }, [editor])

  // Apply width as percentage
  const applyWidthPercentage = (percentage: number) => {
    if (!selectedImage || imagePos === -1) return

    // Calculate container width (editor width)
    const editorWidth = editor.view.dom.clientWidth
    const newWidth = Math.round((editorWidth * percentage) / 100)

    applyImageChanges(newWidth)
  }

  // Apply custom width
  const applyCustomWidth = () => {
    if (!selectedImage || imagePos === -1 || !customWidth) return

    const width = Number.parseInt(customWidth, 10)
    if (isNaN(width) || width <= 0) return

    applyImageChanges(width)
  }

  // Common function to apply changes
  const applyImageChanges = (width: number) => {
    // Update the image in the editor
    const { state, view } = editor

    // Create style string
    const styleString = `width: ${width}px; max-width: 100%; border-radius: 0.5rem; margin: 0.5rem auto; display: block;`

    // Update the node with both width and alt text
    const tr = state.tr.setNodeMarkup(imagePos, undefined, {
      ...state.doc.nodeAt(imagePos)?.attrs,
      width,
      alt: altText,
      style: styleString,
    })

    view.dispatch(tr)
    editor.commands.focus()

    // Close the popover
    setIsOpen(false)
  }

  // Delete image
  const deleteImage = () => {
    if (imagePos === -1) return

    editor.chain().focus().setNodeSelection(imagePos).deleteSelection().run()
    setIsOpen(false)
    setSelectedImage(null)
  }

  if (!selectedImage) return null

  // Get position for the popover
  const rect = selectedImage.getBoundingClientRect()
  const editorElement = editor.view.dom.parentElement
  const editorRect = editorElement?.getBoundingClientRect() || { top: 0, left: 0 }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          style={{
            position: "absolute",
            top: rect.top - editorRect.top,
            left: rect.left - editorRect.left,
            width: rect.width,
            height: rect.height,
            pointerEvents: "none",
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="image-size-dialog w-80 p-3" sideOffset={5}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Image Properties</h3>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Alt Text */}
        <div className="mb-3">
          <Label htmlFor="alt-text" className="text-xs">
            Alt Text
          </Label>
          <Input
            id="alt-text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe this image"
            className="h-8 mt-1"
          />
        </div>

        <Separator className="my-3" />

        <div className="mb-2">
          <Label className="text-xs">Width Presets</Label>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          <Button variant="outline" size="sm" className="w-full" onClick={() => applyWidthPercentage(25)}>
            25%
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={() => applyWidthPercentage(50)}>
            50%
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={() => applyWidthPercentage(75)}>
            75%
          </Button>
          <Button variant="outline" size="sm" className="w-full" onClick={() => applyWidthPercentage(100)}>
            100%
          </Button>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <div className="flex-1">
            <Label htmlFor="custom-width" className="text-xs">
              Custom Width (px)
            </Label>
            <Input
              id="custom-width"
              type="number"
              min="1"
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
              className="h-8"
            />
          </div>
          <Button variant={'outline'} size="sm" className="h-8" onClick={applyCustomWidth}>
            <Check className="h-4 w-4 mr-1" />
          </Button>

           <Button variant="destructive" size="sm" className="h-8" onClick={deleteImage}>
            <Trash2 className="h-4 w-4 mr-1" />
          </Button>

        </div>

      </PopoverContent>
    </Popover>
  )
}

export default ImageSizeDialog
