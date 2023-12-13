"use client";

import type { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

type Props = {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const ArticleEditor = ({ editable, initialContent, onChange }: Props) => {
  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    // editable: false,
  });

  return <BlockNoteView editor={editor} theme="light" className="w-full" />;
};

export default ArticleEditor;
