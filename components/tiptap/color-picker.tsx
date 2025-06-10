"use client"

import type { Editor } from "@tiptap/react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

interface ColorPickerProps {
  editor: Editor
}

const ColorPicker = ({ editor }: ColorPickerProps) => {
  const [customTextColor, setCustomTextColor] = useState("#000000")
  const [customBgColor, setCustomBgColor] = useState("#ffffff")

  const predefinedColors = [
    "#000000",
    "#374151",
    "#6B7280",
    "#9CA3AF",
    "#D1D5DB",
    "#F3F4F6",
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#EAB308",
    "#84CC16",
    "#22C55E",
    "#10B981",
    "#14B8A6",
    "#06B6D4",
    "#0EA5E9",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#A855F7",
    "#D946EF",
    "#EC4899",
    "#F43F5E",
    "#FFFFFF",
  ]

  const backgroundColors = [
    "#FFFFFF",
    "#F8FAFC",
    "#F1F5F9",
    "#E2E8F0",
    "#CBD5E1",
    "#94A3B8",
    "#FEF2F2",
    "#FEF3C7",
    "#ECFDF5",
    "#F0F9FF",
    "#EFF6FF",
    "#F5F3FF",
    "#FDF4FF",
    "#FDF2F8",
    "#FFFBEB",
    "#F0FDF4",
    "#ECFCCB",
    "#FEF3C7",
    "#DBEAFE",
    "#E0E7FF",
    "#EDE9FE",
    "#FAE8FF",
    "#FCE7F3",
    "#000000",
  ]

  const applyTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const applyBackgroundColor = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run()
  }

  const removeTextColor = () => {
    editor.chain().focus().unsetColor().run()
  }

  const removeBackgroundColor = () => {
    editor.chain().focus().unsetHighlight().run()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" title="Colors">
          <Palette className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 mt-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Predefined Colors</Label>
              <div className="grid grid-cols-6 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors relative"
                    style={{ backgroundColor: color }}
                    onClick={() => applyTextColor(color)}
                    title={color}
                  >
                    {color === "#FFFFFF" && <div className="absolute inset-0 border border-gray-300 rounded" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="custom-text-color" className="text-sm font-medium mb-2 block">
                Custom Text Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="custom-text-color"
                  type="color"
                  value={customTextColor}
                  onChange={(e) => setCustomTextColor(e.target.value)}
                  className="w-12 h-8 p-0 border-0"
                />
                <Input
                  type="text"
                  value={customTextColor}
                  onChange={(e) => setCustomTextColor(e.target.value)}
                  placeholder="#000000"
                  minLength={4}
                  maxLength={7}
                  className="flex-1 h-8"
                />
                <Button onClick={() => applyTextColor(customTextColor)} size="sm" className="h-8">
                  Apply
                </Button>
              </div>
            </div>

            <Button onClick={removeTextColor} variant="outline" size="sm" className="w-full">
              Remove Text Color
            </Button>
          </TabsContent>

          <TabsContent value="background" className="space-y-4 mt-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Background Colors</Label>
              <div className="grid grid-cols-6 gap-2">
                {backgroundColors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors relative"
                    style={{ backgroundColor: color }}
                    onClick={() => applyBackgroundColor(color)}
                    title={color}
                  >
                    {color === "#FFFFFF" && <div className="absolute inset-0 border border-gray-300 rounded" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="custom-bg-color" className="text-sm font-medium mb-2 block">
                Custom Background Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="custom-bg-color"
                  type="color"
                  value={customBgColor}
                  onChange={(e) => setCustomBgColor(e.target.value)}
                  className="w-12 h-8 p-0 border-0"
                />
                <Input
                  type="text"
                  value={customBgColor}
                  onChange={(e) => setCustomBgColor(e.target.value)}
                  placeholder="#ffffff"
                  minLength={4}
                  maxLength={7}
                  className="flex-1 h-8"
                />
                <Button onClick={() => applyBackgroundColor(customBgColor)} size="sm" className="h-8">
                  Apply
                </Button>
              </div>
            </div>

            <Button onClick={removeBackgroundColor} variant="outline" size="sm" className="w-full">
              Remove Background Color
            </Button>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ColorPicker
