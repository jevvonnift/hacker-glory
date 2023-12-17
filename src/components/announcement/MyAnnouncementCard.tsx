"use client";

import type { AnnouncementSourceType } from "@prisma/client";
import Image from "next/image";
import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "~/lib/utils";
import type { RouterOutputs } from "~/trpc/shared";
import Badge from "../Badge";
import Avatar from "../Avatar";
import Link from "next/link";

interface Props extends HTMLAttributes<HTMLDivElement> {
  announcement: RouterOutputs["announcement"]["getMine"][number];
}

const MyAnnouncementCard = forwardRef<HTMLDivElement, Props>(
  ({ announcement, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "max-w-lg cursor-pointer rounded-lg bg-white p-4",
          className,
        )}
        ref={ref}
        {...props}
      >
        <Link href={`/editor/${announcement.id}`}>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                alt="User Profile"
                className="h-8 w-8"
                src={announcement.author.image}
              />
              <p className="text-lg text-gray-500">
                {announcement.author.username}
              </p>
            </div>
            {announcement.publishedAt &&
              announcement.publishedAt < new Date() && (
                <Badge type="success">Terunggah</Badge>
              )}

            {announcement.isDraft ? (
              <Badge type="info">Di Draf</Badge>
            ) : (
              !announcement.isAccepted && <Badge type="warning">Menunggu</Badge>
            )}
          </div>

          {announcement.sourceURL !== "" && (
            <div className="my-4 max-h-[300px] overflow-hidden rounded-md">
              <FilePreview
                url={announcement.sourceURL}
                type={announcement.sourceType}
              />
            </div>
          )}

          <div>
            <h2 className="line-clamp-3 break-words text-xl">
              {announcement.title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Dibuat Pada :{" "}
              {announcement.createdAt.toLocaleDateString("id", {
                hour12: false,
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </Link>
      </div>
    );
  },
);

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
          className="max-h-[500px] w-auto rounded-md"
          width={500}
          height={500}
        />
      )}
      {type === "VIDEO" && (
        <video
          src={url}
          className="aspect-video max-h-[400px] w-auto rounded-md"
        />
      )}
    </div>
  );
}

export default MyAnnouncementCard;
