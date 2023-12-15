"use client";

import Button from "~/components/Button";
import {
  ArrowLeftIcon,
  ArrowUpFromLineIcon,
  MessageSquareIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import Modal from "~/components/Modal";
import { useBoolean } from "usehooks-ts";
import { useMemo, useState } from "react";
import ContentFileDropzone from "./SourceDropzone";
import Image from "next/image";
import { AnnouncementSourceType, AnnouncementPriority } from "@prisma/client";
import { cn } from "~/lib/utils";
import InputCalender from "~/components/InputCalender";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import uploadFile from "~/server/lib/uploadFile";
import { type RouterOutputs } from "~/trpc/shared";
import Link from "next/link";

import TextareaAutoSize from "react-textarea-autosize";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import useSession from "~/hooks/useSession";

type Props = {
  announcement: NonNullable<RouterOutputs["announcement"]["getById"]>;
};

const AnnouncementFormSchema = z.object({
  title: z.string(),
  body: z.string(),
  sourceURL: z.string(),
  sourceType: z.nativeEnum(AnnouncementSourceType),
  publishedAt: z.date().nullable(),
  priority: z.nativeEnum(AnnouncementPriority),
  categoryId: z.number(),
});

type InferAnnouncementFormSchema = z.infer<typeof AnnouncementFormSchema>;

const AnnoucementEditor = ({ announcement: annc }: Props) => {
  const [announcement, setAnnouncement] = useState(annc);
  const { data: categories } = api.category.getCategories.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { session } = useSession();

  const { setValue, register, watch, handleSubmit, reset } =
    useForm<InferAnnouncementFormSchema>({
      resolver: zodResolver(AnnouncementFormSchema),
      defaultValues: {
        ...announcement,
      },
    });

  const BlockNoteEditor = useMemo(
    () =>
      dynamic(() => import("~/components/editor/BlockNoteEditor"), {
        ssr: false,
      }),
    [],
  );

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const {
    value: isSaveModalOpen,
    setTrue: openSaveModal,
    setFalse: closeSaveModal,
  } = useBoolean();
  const {
    value: isPublishModalOpen,
    setTrue: openPublishModal,
    setFalse: closePublishModal,
  } = useBoolean();
  const {
    value: isOpenMessageModal,
    setTrue: openMessageModal,
    setFalse: closeMessageModal,
  } = useBoolean();

  const [isUploading, setIsUploading] = useState(false);
  const { mutate: saveAnnouncement } = api.announcement.save.useMutation();
  const { mutate: publishAnnouncement } =
    api.announcement.publish.useMutation();
  const { mutate: requestAnnouncement } =
    api.announcement.request.useMutation();

  const handleSave: SubmitHandler<InferAnnouncementFormSchema> = async (
    data,
  ) => {
    setIsUploading(true);

    if (sourceFile) {
      const result = await uploadFile(sourceFile);
      if (!result.success) {
        setIsUploading(false);
        return toast.error(result.message);
      }

      setValue("sourceURL", result.url);
      setSourceFile(null);
    }
    console.log(data.body);
    saveAnnouncement(
      {
        ...data,
        id: announcement.id,
        sourceURL: watch("sourceURL"),
      },
      {
        onSuccess(data) {
          reset(data);
          setAnnouncement((annc) => ({ ...annc, ...data }));
          toast.success("Pengumuman berhasil disimpan!");
          setIsUploading(false);
          closeSaveModal();
        },
        onError(error) {
          toast.error(error.message);
          setIsUploading(false);
        },
      },
    );
  };

  const handlePublish: SubmitHandler<InferAnnouncementFormSchema> = async (
    data,
  ) => {
    setIsUploading(true);
    publishAnnouncement(
      {
        ...data,
        id: announcement.id,
        sourceURL: watch("sourceURL"),
      },
      {
        onSuccess(data) {
          reset(data);
          setAnnouncement((annc) => ({ ...annc, ...data }));
          toast.success("Pengumuman berhasil di unggah!");
          setIsUploading(false);
        },
        onError(error) {
          setIsUploading(false);
          if (error.data?.code !== "BAD_REQUEST") toast.error(error.message);

          const fieldErrs = error.data?.zodError?.fieldErrors;
          if (!fieldErrs) return;

          Object.keys(fieldErrs).forEach((field: keyof typeof fieldErrs) => {
            const fieldObj = fieldErrs[field];
            if (fieldObj) {
              const msg = fieldObj[0] ?? "";
              toast.error(msg);
            }
          });
        },
      },
    );
  };

  const handleRequest = (isDraft: boolean) => {
    setIsUploading(true);
    requestAnnouncement(
      {
        id: announcement.id,
        isDraft: isDraft,
      },
      {
        onSuccess(data) {
          toast.success("Permintaan pengumuman berhasil dikirim!");
          setAnnouncement((annc) => ({ ...annc, ...data }));
          setIsUploading(false);
        },
        onError(error) {
          toast.error(error.message);
          setIsUploading(false);
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
              onClick={openSaveModal}
              className="text-md flex items-center gap-2 rounded-full p-3 sm:px-4 sm:py-2"
            >
              <SaveIcon strokeWidth={1.5} size={20} />
              <span className="hidden sm:inline">Simpan</span>
            </Button>

            {announcement.rejectedMessage && (
              <Button
                className="relative flex rounded-full p-3"
                onClick={openMessageModal}
              >
                <MessageSquareIcon strokeWidth={1.2} size={20} />
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  1
                </span>
              </Button>
            )}

            {session && (session.user.isAdmin || announcement.isAccepted) && (
              <Button
                className="text-md flex w-full items-center gap-2 rounded-full bg-blue-500 px-4 text-white hover:bg-blue-600 hover:disabled:bg-blue-500"
                onClick={openPublishModal}
              >
                <ArrowUpFromLineIcon strokeWidth={2} size={20} />
                <span>
                  {announcement.publishedAt &&
                  announcement.publishedAt < new Date()
                    ? "Sudah di Unggah"
                    : "Unggah"}
                </span>
              </Button>
            )}

            {session && !session.user.isAdmin && !announcement.isAccepted && (
              <>
                {announcement.isDraft ? (
                  <Button
                    onClick={() => handleRequest(false)}
                    className="text-md flex w-full items-center gap-2 rounded-full bg-blue-500 px-4 text-white hover:bg-blue-600 hover:disabled:bg-blue-500"
                    disabled={isUploading}
                  >
                    <ArrowUpFromLineIcon strokeWidth={2} size={20} />
                    <span>
                      {" "}
                      <span className="hidden sm:inline">Minta</span>{" "}
                      Persetujuan
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRequest(true)}
                    className="text-md flex w-full items-center gap-2 rounded-full bg-red-500 px-4 text-white hover:bg-red-600 hover:disabled:bg-red-500"
                    disabled={isUploading}
                  >
                    <XIcon strokeWidth={2} size={20} />
                    <span>
                      Batalkan{" "}
                      <span className="hidden sm:inline">Permintaan</span>
                    </span>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-4 w-full max-w-5xl rounded-xl bg-white p-6">
          {!watch("sourceURL").length && (
            <ContentFileDropzone
              onFileAccepted={(result) => {
                setValue("sourceURL", result.url);
                setValue("sourceType", result.type);
                setSourceFile(result.file);
              }}
              className="flex h-20 w-full cursor-pointer items-center justify-center rounded-md bg-slate-100"
            />
          )}

          {!!watch("sourceURL").length && (
            <FilePreview
              type={watch("sourceType")}
              onRemove={() => {
                setValue("sourceURL", "");
                setSourceFile(null);
              }}
              url={watch("sourceURL")}
            />
          )}

          <TextareaAutoSize
            className="mt-5 w-full resize-none break-words border-b bg-transparent py-2 text-2xl font-bold text-[#3F3F3F] outline-none transition-all sm:text-3xl"
            placeholder="Judul Pengumuman"
            required={true}
            {...register("title")}
          />
          <BlockNoteEditor
            onChange={(value) => setValue("body", value)}
            initialContent={annc.body}
          />
        </div>
      </div>

      <Modal isOpen={isSaveModalOpen} onClose={closeSaveModal}>
        <h1 className="text-xl">Simpan Pengumuman</h1>

        <div className="mt-2 flex flex-col gap-4">
          {categories && (
            <div>
              <label htmlFor="category" className="mb-2 block text-lg">
                Kategori
              </label>
              <select
                value={watch("categoryId")}
                onChange={(e) =>
                  setValue("categoryId", parseInt(e.target.value))
                }
                className="w-full rounded-md border p-2 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-lg">Prioritas</label>
            <div className="flex gap-2">
              <Button
                className={cn(
                  "flex-1 border-red-500 hover:bg-red-500/80 hover:text-white",
                  watch("priority") === "PENTING" &&
                    "bg-red-500 text-white hover:bg-red-500",
                )}
                onClick={() => setValue("priority", "PENTING")}
              >
                Penting
              </Button>
              <Button
                className={cn(
                  "flex-1 border-yellow-500 hover:bg-yellow-500/80 hover:text-white",
                  watch("priority") === "BIASA" &&
                    "bg-yellow-500 text-white hover:bg-yellow-500",
                )}
                onClick={() => setValue("priority", "BIASA")}
              >
                Biasa
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <form onSubmit={handleSubmit(handleSave)}>
            <Button
              className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600 hover:disabled:bg-blue-500"
              disabled={isUploading}
            >
              Simpan Perubahan
            </Button>
          </form>
        </div>
      </Modal>

      {announcement.isAccepted && (
        <Modal isOpen={isPublishModalOpen} onClose={closePublishModal}>
          <h1 className="text-xl">Unggah Pengumuman</h1>

          <div className="mt-2">
            <div className="mb-2 flex items-center gap-2 text-lg">
              <label htmlFor="publish-date text-lg">Atur Tanggal Unggah</label>
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer"
                checked={!!watch("publishedAt")}
                onChange={(e) =>
                  e.target.checked
                    ? setValue("publishedAt", new Date())
                    : setValue("publishedAt", null)
                }
              />
            </div>
            <AnimatePresence>
              {!!watch("publishedAt") && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <InputCalender
                    showTimeSelect={true}
                    onChange={(date) => setValue("publishedAt", date)}
                    selected={watch("publishedAt")}
                    minDate={new Date()}
                    id="publish-date"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <form onSubmit={handleSubmit(handlePublish)}>
              {!watch("publishedAt") ? (
                <Button className="text-md flex w-full items-center gap-2 rounded-full bg-blue-500 px-4 text-white hover:bg-blue-600 hover:disabled:bg-blue-500">
                  <ArrowUpFromLineIcon strokeWidth={2} size={20} />
                  <span>Unggah Sekarang</span>
                </Button>
              ) : (
                <Button className="text-md flex w-full items-center gap-2 rounded-full px-4 ">
                  <SaveIcon strokeWidth={2} size={20} />
                  <span>Simpan Tanggal</span>
                </Button>
              )}
            </form>
          </div>
        </Modal>
      )}

      {announcement.rejectedMessage && (
        <Modal isOpen={isOpenMessageModal} onClose={closeMessageModal}>
          <h1 className="text-xl">Pesan Dari Admin</h1>

          <h2 className="mt-4 text-lg italic">
            "{announcement.rejectedMessage}"
          </h2>
        </Modal>
      )}
    </>
  );
};

function FilePreview({
  type,
  url,
  onRemove,
}: {
  type: AnnouncementSourceType;
  url: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative flex w-full items-center justify-center">
      <span
        onClick={onRemove}
        className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-red-500 p-1 text-white"
      >
        <XIcon strokeWidth={1} />
      </span>
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
          controls
          className="aspect-video max-h-[400px] w-auto rounded-md"
        />
      )}
    </div>
  );
}

export default AnnoucementEditor;
