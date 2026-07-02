import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export const AlignableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute("data-align") || element.style.textAlign || null,
        renderHTML: (attributes) => {
          if (!attributes.textAlign) {
            return {};
          }

          return { "data-align": attributes.textAlign };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes["data-align"] as string | undefined;

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: align ? `rich-image-align-${align}` : undefined,
      }),
    ];
  },
});
