"use client";

import type { BlockNoteEditor } from "@blocknote/core";
import {
  BlockNoteView,
  FormattingToolbarPositioner,
  HyperlinkToolbarPositioner,
  ImageToolbarPositioner,
  SlashMenuPositioner,
  useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";
import "~/styles/custom.css";

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
  });

  return (
    <BlockNoteView editor={editor} theme="light" className="w-full">
      <FormattingToolbarPositioner editor={editor} />
      <HyperlinkToolbarPositioner editor={editor} />
      <SlashMenuPositioner editor={editor} />
      <ImageToolbarPositioner editor={editor} />
    </BlockNoteView>
  );
};

export default ArticleEditor;
