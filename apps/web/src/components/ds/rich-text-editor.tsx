"use client";

import { CONTENT_VARIABLES } from "@portfolio/contracts";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  FileCode2Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  MessageSquareIcon,
  Redo2Icon,
  TextQuoteIcon,
  Undo2Icon,
} from "lucide-react";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Callout } from "@/components/ds/rich-text-callout-extension";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
  id?: string;
};

export function RichTextEditor({ value, onChange, placeholder, className, minHeight = 180, id }: RichTextEditorProps) {
  const [showMarkdownPanel, setShowMarkdownPanel] = useState(false);
  const [markdownDraft, setMarkdownDraft] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      TiptapLink.configure({ autolink: true, openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Escreva o conteudo..." }),
      Callout,
    ],
    content: value,
    editorProps: {
      attributes: {
        id: id ?? "",
        class: cn(
          "focus:outline-none",
          "[&_p]:mb-2 [&_p:last-child]:mb-0",
          "[&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold",
          "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold",
          "[&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5",
          "[&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_blockquote]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
          "[&_[data-callout]]:mb-2 [&_[data-callout]]:rounded-md [&_[data-callout]]:border [&_[data-callout]]:border-primary/30 [&_[data-callout]]:bg-primary-tint [&_[data-callout]]:p-3",
          "[&_a]:underline [&_a]:underline-offset-2",
          "[&_strong]:font-semibold",
        ),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  function applyMarkdownImport() {
    if (!editor || !markdownDraft.trim()) return;
    const html = marked.parse(markdownDraft, { async: false }) as string;
    editor.commands.setContent(html, { emitUpdate: true });
    setMarkdownDraft("");
    setShowMarkdownPanel(false);
  }

  return (
    <div className={cn("rounded-md border border-input bg-input/20", className)}>
      <RichTextToolbar
        editor={editor}
        markdownPanelOpen={showMarkdownPanel}
        onToggleMarkdownPanel={() => setShowMarkdownPanel((current) => !current)}
      />
      {showMarkdownPanel && (
        <div className="border-b border-border bg-surface-muted/50 p-2">
          <textarea
            className="min-h-24 w-full resize-y rounded-md border border-input bg-input/20 p-2 text-xs font-mono"
            placeholder="Cole o Markdown aqui..."
            value={markdownDraft}
            onChange={(event) => setMarkdownDraft(event.target.value)}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button className="h-8 px-3 text-xs" type="button" variant="ghost" onClick={() => setShowMarkdownPanel(false)}>
              Cancelar
            </Button>
            <Button className="h-8 px-3 text-xs" type="button" onClick={applyMarkdownImport}>
              Converter e substituir conteudo
            </Button>
          </div>
        </div>
      )}
      <EditorContent className="px-3 py-2 text-sm" editor={editor} style={{ minHeight }} />
    </div>
  );
}

function RichTextToolbar({
  editor,
  markdownPanelOpen,
  onToggleMarkdownPanel,
}: {
  editor: Editor;
  markdownPanelOpen: boolean;
  onToggleMarkdownPanel: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-1.5">
      <ToolbarToggle active={editor.isActive("bold")} label="Negrito" onClick={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle active={editor.isActive("italic")} label="Italico" onClick={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon className="size-4" />
      </ToolbarToggle>
      <ToolbarSeparator />
      <ToolbarToggle
        active={editor.isActive("heading", { level: 2 })}
        label="Titulo 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2Icon className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("heading", { level: 3 })}
        label="Titulo 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3Icon className="size-4" />
      </ToolbarToggle>
      <ToolbarSeparator />
      <ToolbarToggle
        active={editor.isActive("bulletList")}
        label="Lista com marcadores"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("orderedList")}
        label="Lista numerada"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle
        active={editor.isActive("blockquote")}
        label="Citacao"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <TextQuoteIcon className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle active={editor.isActive("callout")} label="Callout" onClick={() => editor.chain().focus().toggleCallout().run()}>
        <MessageSquareIcon className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle active={editor.isActive("link")} label="Link" onClick={() => toggleLink(editor)}>
        <Link2Icon className="size-4" />
      </ToolbarToggle>
      <ToolbarSeparator />
      <ToolbarToggle label="Desfazer" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2Icon className="size-4" />
      </ToolbarToggle>
      <ToolbarToggle label="Refazer" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2Icon className="size-4" />
      </ToolbarToggle>
      <ToolbarSeparator />
      <Select
        value=""
        onValueChange={(key) => {
          if (!key) return;
          editor.chain().focus().insertContent(`{${key}}`).run();
        }}
      >
        <SelectTrigger className="h-8 w-auto text-xs text-muted-foreground">
          <SelectValue>{() => "Inserir variavel..."}</SelectValue>
        </SelectTrigger>
        <SelectPopup>
          {CONTENT_VARIABLES.map((variable) => (
            <SelectItem key={variable.key} value={variable.key}>
              {variable.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      <ToolbarToggle active={markdownPanelOpen} label="Importar Markdown" onClick={onToggleMarkdownPanel}>
        <FileCode2Icon className="size-4" />
      </ToolbarToggle>
    </div>
  );
}

function toggleLink(editor: Editor) {
  if (editor.isActive("link")) {
    editor.chain().focus().unsetLink().run();
    return;
  }

  const url = window.prompt("URL do link");
  if (!url) return;
  editor.chain().focus().setLink({ href: url }).run();
}

function ToolbarToggle({
  active,
  children,
  label,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      aria-label={label}
      aria-pressed={active}
      className={cn("size-8 p-0", active && "bg-muted")}
      title={label}
      type="button"
      variant="ghost"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ToolbarSeparator() {
  return <div className="mx-1 h-5 w-px bg-border" />;
}
