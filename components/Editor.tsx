"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef } from "react";

type EditorProps = {
  contenu?: string;
  onSave?: (html: string) => void;
};

export default function Editor({ contenu, onSave }: EditorProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      Underline,
      Placeholder.configure({ placeholder: "Commence à écrire ton cours ici..." }),
    ],
    content: contenu || "",
    immediatelyRender: false,
    editorProps: { attributes: { class: "notion-editor", spellcheck: "true", lang: "fr" } },
    onUpdate: ({ editor }) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { if (onSave) onSave(editor.getHTML()); }, 800);
    },
  });

  if (!editor) return null;

  function Btn({ onClick, active, title, children }: any) {
    return (
      <button 
        onClick={onClick} 
        className={`toolbar-btn ${active ? "active" : ""}`} 
        title={title}
      >
        {children}
      </button>
    );
  }

  return (
    <div>
      <div className="toolbar">
        <div className="toolbar-group">
          <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Gras (Ctrl+B)"><b>B</b></Btn>
          <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italique (Ctrl+I)"><i>I</i></Btn>
          <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Souligné"><u>U</u></Btn>
          <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Barré"><s>S</s></Btn>
        </div>
        <div className="toolbar-group">
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Titre 1">H1</Btn>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Titre 2">H2</Btn>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Titre 3">H3</Btn>
        </div>
        <div className="toolbar-group">
          <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Liste à puces">•</Btn>
          <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Liste numérotée">1.</Btn>
          <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Bloc citation">&ldquo;</Btn>
          <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Bloc de code">&lt;/&gt;</Btn>
        </div>
        <div className="toolbar-group">
          <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()} title="Surligner en jaune"><span className="toolbar-color color-yellow"></span></Btn>
          <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: "#86efac" }).run()} title="Surligner en vert"><span className="toolbar-color color-green"></span></Btn>
          <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: "#93c5fd" }).run()} title="Surligner en bleu"><span className="toolbar-color color-blue"></span></Btn>
          <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: "#f87171" }).run()} title="Surligner en rouge"><span className="toolbar-color color-red"></span></Btn>
          <Btn onClick={() => editor.chain().focus().unsetHighlight().run()} title="Enlever la surbrillance">✕</Btn>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}