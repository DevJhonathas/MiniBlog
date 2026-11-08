import { useEffect } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";

import styles from "./RichTextEditor.module.css";

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  TextStyleKit,
  Placeholder.configure({
    placeholder: "Comece a escrever sua publicação...",
  }),
];

const RichTextEditor = ({ value = "", onChange }) => {
  const editor = useEditor({
    extensions,
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null;

      const textStyle = editor.getAttributes("textStyle");

      return {
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        strike: editor.isActive("strike"),
        heading1: editor.isActive("heading", { level: 1 }),
        heading2: editor.isActive("heading", { level: 2 }),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        blockquote: editor.isActive("blockquote"),
        color: textStyle.color || "#17231d",
        backgroundColor: textStyle.backgroundColor || "#fff3b0",
        fontSize: textStyle.fontSize || "",
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      };
    },
  });

  if (!editor) {
    return <div className={styles.loading}>Preparando editor...</div>;
  }

  const buttonClass = (active = false) =>
    `${styles.toolButton} ${active ? styles.active : ""}`;

  return (
    <div className={styles.editor}>
      <div
        className={styles.toolbar}
        role="toolbar"
        aria-label="Formatação do texto"
      >
        <div className={styles.toolGroup}>
          <button
            type="button"
            className={buttonClass(editorState?.heading1)}
            title="Título 1"
            aria-label="Título 1"
            aria-pressed={editorState?.heading1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>

          <button
            type="button"
            className={buttonClass(editorState?.heading2)}
            title="Título 2"
            aria-label="Título 2"
            aria-pressed={editorState?.heading2}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>

          <button
            type="button"
            className={buttonClass()}
            title="Parágrafo"
            aria-label="Parágrafo"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            P
          </button>
        </div>

        <span className={styles.divider} />

        <div className={styles.toolGroup}>
          <button
            type="button"
            className={buttonClass(editorState?.bold)}
            title="Negrito"
            aria-label="Negrito"
            aria-pressed={editorState?.bold}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            className={buttonClass(editorState?.italic)}
            title="Itálico"
            aria-label="Itálico"
            aria-pressed={editorState?.italic}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </button>

          <button
            type="button"
            className={buttonClass(editorState?.underline)}
            title="Sublinhado"
            aria-label="Sublinhado"
            aria-pressed={editorState?.underline}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </button>

          <button
            type="button"
            className={buttonClass(editorState?.strike)}
            title="Tachado"
            aria-label="Tachado"
            aria-pressed={editorState?.strike}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <s>S</s>
          </button>
        </div>

        <span className={styles.divider} />

        <div className={styles.toolGroup}>
          <label className={styles.colorControl} title="Cor do texto">
            <span>A</span>
            <input
              type="color"
              value={editorState?.color || "#17231d"}
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
              aria-label="Escolher cor do texto"
            />
          </label>

          <label className={styles.colorControl} title="Cor de destaque">
            <span className={styles.highlightIcon}>A</span>
            <input
              type="color"
              value={editorState?.backgroundColor || "#fff3b0"}
              onChange={(e) =>
                editor.chain().focus().setBackgroundColor(e.target.value).run()
              }
              aria-label="Escolher cor de fundo do texto"
            />
          </label>

          <select
            className={styles.fontSize}
            value={editorState?.fontSize || ""}
            onChange={(e) => {
              if (e.target.value) {
                editor.chain().focus().setFontSize(e.target.value).run();
              } else {
                editor.chain().focus().unsetFontSize().run();
              }
            }}
            aria-label="Tamanho da fonte"
            title="Tamanho da fonte"
          >
            <option value="">Tamanho</option>
            <option value="14px">Pequeno</option>
            <option value="16px">Normal</option>
            <option value="20px">Grande</option>
            <option value="24px">Muito grande</option>
            <option value="32px">Extra grande</option>
          </select>
        </div>

        <span className={styles.divider} />

        <div className={styles.toolGroup}>
          <button
            type="button"
            className={buttonClass(editorState?.bulletList)}
            title="Lista com marcadores"
            aria-label="Lista com marcadores"
            aria-pressed={editorState?.bulletList}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • Lista
          </button>

          <button
            type="button"
            className={buttonClass(editorState?.orderedList)}
            title="Lista numerada"
            aria-label="Lista numerada"
            aria-pressed={editorState?.orderedList}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. Lista
          </button>

          <button
            type="button"
            className={buttonClass(editorState?.blockquote)}
            title="Citação"
            aria-label="Citação"
            aria-pressed={editorState?.blockquote}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            ❝
          </button>
        </div>

        <span className={styles.divider} />

        <div className={styles.toolGroup}>
          <button
            type="button"
            className={styles.toolButton}
            title="Desfazer"
            aria-label="Desfazer"
            disabled={!editorState?.canUndo}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            ↶
          </button>

          <button
            type="button"
            className={styles.toolButton}
            title="Refazer"
            aria-label="Refazer"
            disabled={!editorState?.canRedo}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            ↷
          </button>

          <button
            type="button"
            className={styles.toolButton}
            title="Limpar formatação"
            aria-label="Limpar formatação"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
          >
            Tx
          </button>
        </div>
      </div>

      <div className={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>

      <div className={styles.editorFooter}>
        <span>Selecione um trecho para aplicar a formatação.</span>
        <span>
          {editor.storage.characterCount?.characters?.() ??
            editor.getText().length}{" "}
          caracteres
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;
