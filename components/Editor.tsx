"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef } from "react";
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, TextQuote, Code, Eraser } from "lucide-react";

type EditorProps = {
  contenu?: string;
  onSave?: (html: string) => void;
};

export default function Editor({ contenu, onSave }: EditorProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
         heading: { levels: [1, 2, 3] },
      }),
      Highlight.configure({ multicolor: true }),
      Underline,
      Placeholder.configure({ placeholder: "Commencez à écrire votre cours ici..." }),
    ],
    content: contenu || "",
    immediatelyRender: false,
    editorProps: { 
      attributes: { 
        class: "prose prose-invert max-w-none focus:outline-none min-h-[50vh] text-lg text-white/90 leading-relaxed",
      } 
    },
    onUpdate: ({ editor }) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { if (onSave) onSave(editor.getHTML()); }, 800);
    },
  });

  if (!editor) return null;

  function Btn({ onClick, active, title, children }: any) {
    return (
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
          active
            ? "bg-indigo-500/20 text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            : "text-white/50 hover:bg-white/10 hover:text-white"
        }`}
        title={title}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="relative w-full flex flex-col gap-6">
      {/* Floating Toolbar */}
      <div className="sticky top-20 z-40 bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-wrap items-center gap-1.5 shadow-2xl">
        
        {/* Style */}
        <div className="flex items-center bg-white/5 rounded-xl p-1 gap-0.5">
          <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Gras"><Bold size={18} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italique"><Italic size={18} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Souligné"><UnderlineIcon size={18} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Barré"><Strikethrough size={18} /></Btn>
        </div>

        {/* Headings */}
        <div className="flex items-center bg-white/5 rounded-xl p-1 gap-0.5 ml-2">
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Titre 1"><Heading1 size={18} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Titre 2"><Heading2 size={18} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Titre 3"><Heading3 size={18} /></Btn>
        </div>

        {/* Lists & Blocks */}
        <div className="flex items-center bg-white/5 rounded-xl p-1 gap-0.5 ml-2">
          <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Liste à puces"><List size={18} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Liste numérotée"><ListOrdered size={18} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citation"><TextQuote size={18} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code"><Code size={18} /></Btn>
        </div>

        {/* Highlights */}
        <div className="flex items-center bg-white/5 rounded-xl p-1 gap-0.5 ml-2">
          <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: "rgba(250, 204, 21, 0.4)" }).run()} title="Jaune">
            <div className="w-4 h-4 rounded-full bg-yellow-400/80 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: "rgba(74, 222, 128, 0.4)" }).run()} title="Vert">
            <div className="w-4 h-4 rounded-full bg-green-400/80 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: "rgba(96, 165, 250, 0.4)" }).run()} title="Bleu">
            <div className="w-4 h-4 rounded-full bg-blue-400/80 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleHighlight({ color: "rgba(248, 113, 113, 0.4)" }).run()} title="Rouge">
            <div className="w-4 h-4 rounded-full bg-red-400/80 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
          </Btn>
          <button              type="button"
             onMouseDown={(e) => e.preventDefault()}             onClick={() => editor.chain().focus().unsetHighlight().run()} 
             className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-all" 
             title="Enlever la surbrillance"
          >
            <Eraser size={18} />
          </button>
        </div>
      </div>
      
      {/* Editor Content Box */}
      <div className="bg-black/10 border border-white/5 rounded-3xl p-8 md:p-12 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] liquid-glass relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent blur-sm" />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}