"use client";

import { type AnnouncementSourceType } from "@prisma/client";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import Button from "~/components/Button";
import { type RouterOutputs } from "~/trpc/shared";
import TextareaAutoSize from "react-textarea-autosize";
import Avatar from "~/components/Avatar";

type Props = {
  announcement: NonNullable<RouterOutputs["announcement"]["getById"]>;
};

const AnnouncementPreview = ({ announcement }: Props) => {
  const BlockNoteEditor = useMemo(
    () =>
      dynamic(() => import("~/components/editor/BlockNoteEditor"), {
        ssr: false,
      }),
    [],
  );

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="justify-beetwen flex w-full max-w-5xl items-center justify-between gap-2">
        <Link href="/" shallow={true}>
          <Button className="flex items-center gap-2 rounded-full p-3 sm:px-4 sm:py-2">
            <ArrowLeftIcon strokeWidth={1.5} size={20} />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button className="text-md flex items-center gap-2 rounded-full px-4">
            <CheckIcon className="text-green" strokeWidth={1.5} size={20} />
            <span>Setujui</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 w-full max-w-5xl rounded-xl bg-white p-6">
        <div className="flex items-center gap-2">
          <Avatar
            src={announcement.author.image}
            alt="User Profile"
            className="h-8 w-8"
          />
          <span>{announcement.author.username}</span>
        </div>
        <FilePreview
          type={announcement.sourceType}
          url={announcement.sourceURL}
        />
        <TextareaAutoSize
          className="mt-5 w-full resize-none break-words border-b bg-transparent py-2 text-2xl font-bold text-[#3F3F3F] outline-none transition-all sm:text-3xl"
          placeholder="Judul Pengumuman"
          disabled={true}
          defaultValue={announcement.title}
        />
        <BlockNoteEditor initialContent={announcement.body} editable={false} />
      </div>
    </div>
  );
};

function FilePreview({
  type,
  url,
}: {
  type: AnnouncementSourceType;
  url: string;
}) {
  return (
    <div className="relative flex w-full items-center justify-center">
      {type === "IMAGE" && url !== "" && (
        <Image
          src={url}
          alt="Content Image"
          className="max-h-[500px] w-auto rounded-md"
          width={500}
          height={500}
        />
      )}
      {type === "VIDEO" && url !== "" && (
        <video
          src={url}
          controls
          className="aspect-video max-h-[400px] w-auto rounded-md"
        />
      )}
    </div>
  );
}

export default AnnouncementPreview;
