"use client";

import dynamic from "next/dynamic";
import {
  type HTMLAttributes,
  forwardRef,
  useMemo,
  useState,
  useEffect,
} from "react";
import TextareaAutoSize from "react-textarea-autosize";
import { DEFAULT_ANNOUNCEMENT_BODY, cn } from "~/lib/utils";

export type EditorContent = {
  title: string;
  body: string;
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  onValueChange: (value: EditorContent) => void;
  value: EditorContent;
}

const ArticleEditor = forwardRef<HTMLDivElement, Props>(
  ({ className, onValueChange, value }, ref) => {
    const [title, setTitle] = useState(value.title);
    const [body, setBody] = useState(value.body);

    const BlockNoteEditor = useMemo(
      () =>
        dynamic(() => import("~/components/editor/BlockNoteEditor"), {
          ssr: false,
        }),
      [],
    );

    useEffect(() => {
      onValueChange({ title, body });
    }, [title, body]);

    return (
      <div className={cn("flex w-full flex-col gap-4", className)} ref={ref}>
        <TextareaAutoSize
          className="mt-5 resize-none  break-words border-b bg-transparent py-2 text-2xl font-bold text-[#3F3F3F] outline-none transition-all sm:text-3xl"
          placeholder="Judul Pengumuman"
          value={value.title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="mt-4">
          <BlockNoteEditor
            onChange={setBody}
            initialContent={body ?? undefined}
          />
        </div>
      </div>
    );
  },
);

export default ArticleEditor;
