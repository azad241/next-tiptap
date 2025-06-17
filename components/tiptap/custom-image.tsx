import { mergeAttributes } from "@tiptap/core"
import Image from "@tiptap/extension-image"

export const CustomImage = Image.extend({
  name: "customImage",

  addAttributes() {
    return {
      ...this.parent?.(),

      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) return {}
          return {
            class: attributes.class,
          }
        },
      },

      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {}
          return {
            style: attributes.style,
          }
        },
      },

      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) return {}
          return {
            width: attributes.width,
          }
        },
      },

      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (!attributes.height) return {}
          return {
            height: attributes.height,
          }
        },
      },

      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          if (!attributes.title) return {}
          return {
            title: attributes.title,
          }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
})
