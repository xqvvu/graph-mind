// Tiptap Document Structure (ProseMirror JSON)
export interface ScriptContent {
  type: "doc";
  content: Array<{
    type: "paragraph" | "heading" | "bulletList" | "orderedList";
    attrs?: {
      level?: number; // For headings (1-6)
      textAlign?: "left" | "center" | "right";
    };
    content?: Array<{
      type: "text" | "hardBreak";
      text?: string;
      marks?: Array<{
        type: "bold" | "italic" | "strike" | "highlight" | "bubbleReminder";
        attrs?: {
          // Highlight mark
          color?: "yellow" | "red" | "blue";
          // BubbleReminder mark
          note?: string;
          type?: "timing" | "delivery" | "pronunciation";
        };
      }>;
    }>;
  }>;
}

// Empty document template
export const EMPTY_SCRIPT_CONTENT: ScriptContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};
