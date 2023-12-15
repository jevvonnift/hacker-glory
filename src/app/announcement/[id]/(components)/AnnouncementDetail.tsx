"use client";

import type { AnnouncementSourceType } from "@prisma/client";
import Image from "next/image";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import AnnouncementPriorityBadge from "~/components/announcement/AnnouncementPriorityBadge";
import Avatar from "~/components/Avatar";

type Props = {
  announcement: NonNullable<
    RouterOutputs["announcement"]["getDetailAnnouncement"]
  >;
};

const AnnouncementDetail = ({ announcement: initialAnnouncement }: Props) => {
  const { data: announcement } =
    api.announcement.getDetailAnnouncement.useQuery(
      {
        id: initialAnnouncement.id,
      },
      {
        initialData: initialAnnouncement,
      },
    );

  const BlockNoteEditor = useMemo(
    () =>
      dynamic(() => import("~/components/editor/BlockNoteEditor"), {
        ssr: false,
        loading: () => <div>Loading...</div>,
      }),
    [],
  );

  return announcement ? (
    <div className="w-full max-w-4xl rounded-xl bg-white p-6">
      <div className="mb-2 flex w-full flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar
            src={announcement.author.image}
            alt="User Profile"
            className="h-10 w-10"
          />
          <span>{announcement.author.username}</span>
        </div>
        {announcement.priority === "PENTING" && (
          <div>
            <AnnouncementPriorityBadge priority={announcement.priority} />
          </div>
        )}
        <div>
          <span className="rounded-full border px-4 py-2 ">
            Pengumuman {announcement.category.name}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <FilePreview
          type={announcement.sourceType}
          url={announcement.sourceURL}
        />
      </div>

      <h1 className="my-4 text-2xl font-semibold text-[#3F3F3F] sm:text-3xl">
        {announcement.title}
      </h1>

      <BlockNoteEditor initialContent={announcement.body} editable={false} />
    </div>
  ) : null;
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
      {type === "IMAGE" && (
        <Image
          src={url}
          alt="Content Image"
          className="h-auto w-auto  rounded-md"
          width={500}
          height={500}
        />
      )}
      {type === "VIDEO" && (
        <video
          src={url}
          controls
          className="aspect-video max-h-[400px] w-auto rounded-md"
        />
      )}
    </div>
  );
}

export default AnnouncementDetail;
