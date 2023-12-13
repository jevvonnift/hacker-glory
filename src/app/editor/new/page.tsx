"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import TextareaAutoSize from "react-textarea-autosize";

const EditorNewAnnouncementPage = () => {
  const params = useSearchParams();
  const type = params.get("type");
  const router = useRouter();

  const ArticleEditor = useMemo(
    () =>
      dynamic(() => import("~/components/editor/ArticleEditor"), {
        ssr: false,
      }),
    [],
  );

  if (!type || (type !== "article" && type !== "board")) {
    router.replace("/editor/new?type=article");
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl">Pengumuman Baru</h1>
      </div>
      {type == "article" && (
        <div className="mt-4 flex w-full max-w-5xl flex-col gap-4 rounded-xl bg-white p-6">
          <TextareaAutoSize
            className="ml-[54px] mt-5 resize-none break-words border-b bg-transparent py-2 text-2xl font-bold text-[#3F3F3F] outline-none sm:text-3xl"
            defaultValue="Pengumuman Hari Ini"
          />
          <div className="mt-4">
            <ArticleEditor onChange={(val) => console.log(val)} />
          </div>
        </div>
      )}
      {type == "board" && <div>board editor</div>}
    </div>
  );
};

export default EditorNewAnnouncementPage;
