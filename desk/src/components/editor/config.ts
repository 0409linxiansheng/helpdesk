import { __ } from "@/translation";
import {
  RichTextKit,
  Paragraph,
  HeadingGroup as FrappeUIHeadingGroup,
  Separator,
  Bold,
  Italic,
  Strike,
  FontColor,
  FontHighlight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BulletList,
  OrderedList,
  Blockquote,
  InlineCode,
  InsertLink,
  InsertImage,
  InsertVideo,
  InsertTable,
  HorizontalRule,
  commentToolbar as frappeUICommentToolbar,
  type MenuItem,
  type CommandMenuItem,
  type MenuGroupItem,
} from "frappe-ui/editor";
import type { MaybeRefOrGetter } from "vue";
import { CleanStyles, ComponentUtils, HandleExcelPaste } from "@/tiptap-extensions";

/** A mentionable agent as the new editor expects it: `{ id, label }`. */
export interface MentionItem {
  id: string;
  label: string;
}

/**
 * Build the extension list for a Helpdesk rich-text editor.
 *
 * Mentions are passed as a reactive getter so the `@` list stays in sync as
 * agents load (the v0 `:mentions` snapshot prop is what broke suggestions).
 */
export function buildEditorExtensions(options: {
  mentions?: MaybeRefOrGetter<MentionItem[]>;
  extra?: unknown[];
} = {}) {
  const kit = RichTextKit.configure({
    heading: { levels: [2, 3, 4, 5, 6] },
    ...(options.mentions ? { mention: { items: options.mentions } } : {}),
  });
  return [
    kit,
    ComponentUtils,
    HandleExcelPaste,
    CleanStyles,
    ...(options.extra ?? []),
  ];
}

/**
 * frappe-ui ships `HeadingGroup` with a hard-coded English label (`'Heading'`),
 * which the para/heading dropdown in the toolbar renders verbatim. Re-declare it
 * locally with a translated label so it shows 标题.
 */
const HeadingGroup: MenuGroupItem = {
  ...FrappeUIHeadingGroup,
  label: __("Heading"),
};

/** Clear-formatting toolbar button (ports the v0 `ClearFormattingUtility`). */
export const ClearFormatting: CommandMenuItem = {
  label: __('Clear formatting'),
  icon: "lucide-brush-cleaning",
  action: (editor) =>
    editor.chain().focus().unsetAllMarks().clearNodes().cleanStyles().run(),
};

/**
 * frappe-ui ships its toolbar menu items with hard-coded English labels
 * (`Bold`, `Strike`, `Align Left`, group `Heading` with `Heading 2..4`, …),
 * which the editor renders verbatim in button tooltips and the
 * paragraph/heading dropdown. Recursively replace every item's `label` — and
 * the labels of nested group `items` — with `__()` so they go through the
 * translation dictionary. Returns fresh objects, so the imported menu items
 * (shared module singletons) are never mutated. Items without a label
 * (e.g. `Separator`) pass through untouched.
 */
function translateMenuItems<T extends MenuItem[]>(items: T): T {
  const walk = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(walk);
    if (!item || typeof item !== "object") return item;
    const next = { ...(item as Record<string, unknown>) };
    if (typeof next.label === "string") next.label = __(next.label);
    if (Array.isArray(next.items)) next.items = next.items.map(walk);
    return next;
  };
  return walk(items) as T;
}

/** Full toolbar mirroring the v0 `textEditorMenuButtons`. */
export const fullToolbar: MenuItem[] = translateMenuItems([
  HeadingGroup,
  Separator,
  Bold,
  Italic,
  Strike,
  FontColor,
  FontHighlight,
  Separator,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Separator,
  BulletList,
  OrderedList,
  Blockquote,
  InlineCode,
  Separator,
  InsertLink,
  InsertImage,
  InsertVideo,
  InsertTable,
  HorizontalRule,
  Separator,
  ClearFormatting,
]);

/**
 * Curated toolbar for the new-ticket / base editor (ports the v0 `fixedMenu`).
 * Kept compact so the toolbar + Discard/Submit fit on one row.
 */
export const ticketToolbar: MenuItem[] = translateMenuItems([
  Paragraph,
  HeadingGroup,
  Separator,
  Bold,
  Italic,
  Separator,
  BulletList,
  OrderedList,
  Separator,
  InsertImage,
  InsertVideo,
  InsertLink,
  Blockquote,
  InlineCode,
  ClearFormatting,
]);

/** Compact bubble/inline toolbar for comment display + inline editing. */
export const commentToolbar: MenuItem[] = translateMenuItems(
  frappeUICommentToolbar
);
