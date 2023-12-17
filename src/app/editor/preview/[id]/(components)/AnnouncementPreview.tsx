"use client";

import { type AnnouncementSourceType } from "@prisma/client";
import { ArrowLeftIcon, CheckIcon, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Button from "~/components/Button";
import { type RouterOutputs } from "~/trpc/shared";
import TextareaAutoSize from "react-textarea-autosize";
import Avatar from "~/components/Avatar";
import { api } from "~/trpc/react";
import Modal from "~/components/Modal";
import Input from "~/components/Input";
import { useBoolean } from "usehooks-ts";
import toast from "react-hot-toast";
import AnnouncementPriorityBadge from "~/components/announcement/AnnouncementPriorityBadge";
import { useRouter } from "next/navigation";

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
  const {
    setTrue: openModal,
    setFalse: closeModal,
    value: isModalOpen,
  } = useBoolean();
  const [rejectedMessage, setRejectedMessage] = useState("");

  const { mutate: acceptOrReject, isLoading } =
    api.announcement.acceptOrReject.useMutation();

  const router = useRouter();

  const handleAcceptOrReject = (isAccepted: boolean) => {
    if (!isAccepted && rejectedMessage === "")
      return toast.error("Alasan harus diisi!");
    acceptOrReject(
      {
        id: announcement.id,
        isAccepted,
        rejectedMessage: !isAccepted ? rejectedMessage : null,
      },
      {
        onSuccess: () => {
          toast.success(
            `Pengumuman berhasil di${isAccepted ? "setujui" : "tolak"}!`,
          );
          closeModal();
          setRejectedMessage("");
          router.push("/");
        },
        onError: () => {
          toast.error("Pengumuman berhasil di setujui!");
        },
      },
    );
  };

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="justify-beetwen flex w-full max-w-5xl items-center justify-between gap-2">
          <Link href="/" shallow={true}>
            <Button className="flex items-center gap-2 rounded-full p-3 sm:px-4 sm:py-2">
              <ArrowLeftIcon strokeWidth={1.5} size={20} />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              className="text-md flex items-center gap-2 rounded-full bg-red-500 px-4 text-white hover:bg-red-600 hover:disabled:bg-red-500"
              onClick={openModal}
            >
              <XIcon strokeWidth={1.5} size={20} />
              <span>Tolak</span>
            </Button>

            <Button
              className="text-md flex items-center gap-2 rounded-full bg-green-500 px-4 text-white hover:bg-green-600 hover:disabled:bg-green-500"
              onClick={() => handleAcceptOrReject(true)}
              disabled={isLoading}
            >
              <CheckIcon strokeWidth={1.5} size={20} />
              <span>Setujui</span>
            </Button>
          </div>
        </div>

        <div className="mt-4 w-full max-w-5xl rounded-xl bg-white p-6">
          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar
                src={announcement.author.image}
                alt="User Profile"
                className="h-10 w-10"
              />
              <span>{announcement.author.username}</span>
            </div>
            <div>
              <AnnouncementPriorityBadge priority={announcement.priority} />
            </div>
            <div>
              <span className="rounded-full border px-4 py-2 ">
                Kategori : {announcement.category.name}
              </span>
            </div>
          </div>
          <div className="mt-4">
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
            <BlockNoteEditor
              initialContent={announcement.body}
              editable={false}
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1 className="text-xl">Tolak Pengumuman</h1>

        <div>
          <label htmlFor="rejected-message" className="text-lg">
            Alasan
          </label>
          <Input
            value={rejectedMessage}
            onChange={(e) => setRejectedMessage(e.target.value)}
            className="text-md mt-2"
            placeholder="Konten perlu gambar..."
            id="rejected-message"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            className="text-md flex items-center gap-2 rounded-full bg-red-500 px-4 text-white hover:bg-red-600 hover:disabled:bg-red-500"
            disabled={isLoading}
            onClick={() => handleAcceptOrReject(false)}
          >
            <XIcon strokeWidth={1.5} size={20} />
            <span>Tolak</span>
          </Button>
        </div>
      </Modal>
    </>
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
