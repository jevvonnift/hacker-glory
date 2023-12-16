"use client";

import type { AnnouncementSourceType } from "@prisma/client";
import Image from "next/image";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import AnnouncementPriorityBadge from "~/components/announcement/AnnouncementPriorityBadge";
import Avatar from "~/components/Avatar";
import Skeleton from "~/components/Skeleton";
import Button from "~/components/Button";
import { ArrowLeftIcon, BookmarkIcon, MessagesSquareIcon } from "lucide-react";
import toast from "react-hot-toast";
import useSession from "~/hooks/useSession";
import { useRouter } from "next/navigation";
import { useBoolean } from "usehooks-ts";
import AnnouncementCommentsModal from "~/components/announcement/AnnouncementCommentsModal";

type Props = {
  announcement: NonNullable<
    RouterOutputs["announcement"]["getDetailAnnouncement"]
  >;
};

const AnnouncementDetail = ({ announcement: initialAnnouncement }: Props) => {
  const { session } = useSession();
  const router = useRouter();

  const {
    value: isOpenModalComment,
    setTrue: openModalComment,
    setFalse: closeModalComment,
  } = useBoolean();

  const { data: announcement, refetch: refetchAnnouncement } =
    api.announcement.getDetailAnnouncement.useQuery(
      {
        id: initialAnnouncement.id,
      },
      {
        initialData: initialAnnouncement,
      },
    );

  const { mutate: bookmarkAnouncement, isLoading: isLoadingBookmarked } =
    api.announcement.bookmark.useMutation();

  const BlockNoteEditor = useMemo(
    () =>
      dynamic(() => import("~/components/editor/BlockNoteEditor"), {
        ssr: false,
        loading: () => <Skeleton className="h-7 w-full rounded-md" />,
      }),
    [],
  );

  const handleBookmark = (bookmark: boolean) => {
    if (!session) return toast.error("Masuk ke akun kamu terlebih dahulu!");
    if (!announcement) return;

    bookmarkAnouncement(
      {
        id: announcement.id,
        bookmark,
      },
      {
        async onSuccess() {
          toast.success(
            bookmark
              ? "Berhasil meyimpan pengumuman"
              : "Berhasil menghapus pengumuman dari daftar tersimpan.",
          );
          await refetchAnnouncement();
        },
        onError() {
          toast.error("Gagal menyimpan pengnumuman");
        },
      },
    );
  };

  return announcement ? (
    <>
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between gap-2">
          <Button
            className="flex w-max items-center gap-2 rounded-full sm:px-4"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon strokeWidth={1.2} />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
          <div className="flex gap-2">
            <Button className="rounded-full  p-2" onClick={openModalComment}>
              <MessagesSquareIcon strokeWidth={1.2} />
            </Button>
            {!!announcement.savedBy?.length ? (
              <Button
                className="rounded-full bg-yellow-500 p-2 text-white hover:bg-yellow-500 hover:disabled:bg-yellow-500"
                onClick={() => handleBookmark(false)}
                disabled={isLoadingBookmarked}
              >
                <BookmarkIcon strokeWidth={1.2} fill="white" />
              </Button>
            ) : (
              <Button
                className="rounded-full p-2"
                onClick={() => handleBookmark(true)}
                disabled={isLoadingBookmarked}
              >
                <BookmarkIcon strokeWidth={1.2} />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-white p-6">
          <div className="mb-2 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between ">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Avatar
                  src={announcement.author.image}
                  alt="User Profile"
                  className="h-9 w-9"
                />
                <span>{announcement.author.username}</span>
              </div>
              <div>
                <span className="rounded-full border px-4 py-2 text-sm">
                  Pengumuman {announcement.category.name}
                </span>
              </div>
            </div>
            <div>
              {announcement.priority === "PENTING" && (
                <div>
                  <AnnouncementPriorityBadge priority={announcement.priority} />
                </div>
              )}
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

          <BlockNoteEditor
            initialContent={announcement.body}
            editable={false}
          />
        </div>
      </div>

      <AnnouncementCommentsModal
        isOpen={isOpenModalComment}
        onClose={closeModalComment}
        announcementId={announcement.id}
      />
    </>
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
