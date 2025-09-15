/* eslint-disable @typescript-eslint/no-explicit-any */

import { mergeAttributes } from "@tiptap/core"
import Image from "@tiptap/extension-image"

export const CustomImage = Image.extend({
  name: "customImage",

  addAttributes() {
    return {
      //@ts-expect-error ts(2345) as old
      ...this.parent?.(),

      class: {
        default: null,
        parseHTML: (element: { getAttribute: (arg0: string) => any }) => element.getAttribute("class"),
        renderHTML: (attributes: { class: any }) => {
          if (!attributes.class) return {}
          return {
            class: attributes.class,
          }
        },
      },

      style: {
        default: null,
        parseHTML: (element: { getAttribute: (arg0: string) => any }) => element.getAttribute("style"),
        renderHTML: (attributes: { style: any }) => {
          if (!attributes.style) return {}
          return {
            style: attributes.style,
          }
        },
      },

      width: {
        default: null,
        parseHTML: (element: { getAttribute: (arg0: string) => any }) => element.getAttribute("width"),
        renderHTML: (attributes: { width: any }) => {
          if (!attributes.width) return {}
          return {
            width: attributes.width,
          }
        },
      },

      height: {
        default: null,
        parseHTML: (element: { getAttribute: (arg0: string) => any }) => element.getAttribute("height"),
        renderHTML: (attributes: { height: any }) => {
          if (!attributes.height) return {}
          return {
            height: attributes.height,
          }
        },
      },

      title: {
        default: null,
        parseHTML: (element: { getAttribute: (arg0: string) => any }) => element.getAttribute("title"),
        renderHTML: (attributes: { title: any }) => {
          if (!attributes.title) return {}
          return {
            title: attributes.title,
          }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes : { ...HTMLAttributes } }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
})
