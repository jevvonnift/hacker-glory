"use client";

import ArticleEditor, { type EditorContent } from "./ArticleEditor";
import Button from "~/components/Button";
import { ArrowLeftIcon, CheckIcon, SaveIcon, XIcon } from "lucide-react";
import Modal from "~/components/Modal";
import { useBoolean } from "usehooks-ts";
import { useEffect, useState } from "react";
import ContentFileDropzone, { type FileResult } from "./ContentFileDropzone";
import Image from "next/image";
import useSession from "~/hooks/useSession";
import { type AnnouncementPriority } from "@prisma/client";
import { cn } from "~/lib/utils";
import InputCalender from "~/components/InputCalender";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";
import uploadFile from "~/server/lib/uploadFile";
import { type RouterOutputs } from "~/trpc/shared";
import Link from "next/link";

type NonNullable<T> = Exclude<T, null | undefined>;

type Props = {
  announcement: NonNullable<RouterOutputs["announcement"]["getById"]>;
};

const AnnoucementEditor = ({ announcement }: Props) => {
  const {
    value: isOpenSaveModal,
    setFalse: closeSaveModal,
    setTrue: openSaveModal,
  } = useBoolean();

  const { data: categories } = api.category.getCategories.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const [contentFile, setMainContentFile] = useState<FileResult | null>(null);
  const [titleAndBody, setTitleAndBody] = useState<EditorContent>({
    title: announcement.title,
    body: announcement.body,
  });
  const [priority, setPriority] = useState<AnnouncementPriority>(
    announcement.priority,
  );
  const [publishDate, setPublishDate] = useState<Date | null>(
    announcement.publishedAt,
  );
  const [categoryId, setCategoryId] = useState<number>(announcement.categoryId);

  const { session } = useSession();

  const handleSubmit = async (saveType: "publish" | "request" | "draft") => {
    if (!categoryId) return;
    if (!contentFile)
      return toast.error("Upload gambar atau video konten terlebih dahulu");
    if (!titleAndBody)
      return toast.error("Isi judul dan konten artikel kamu terlebih dahulu");
    if (!titleAndBody.title || !titleAndBody.body)
      return toast.error("Isi judul dan konten artikel kamu terlebih dahulu");

    const fileResult = await uploadFile(contentFile.file);
    if (!fileResult.success) {
      return toast.error(fileResult.message);
    }

    // const sourceType = contentFile.type;
    // const title = titleAndBody.title;
    // const body = titleAndBody.body;
  };

  useEffect(() => {
    if (categories && !!categories[0]) setCategoryId(categories[0].id);
  }, [categories]);

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="justify-beetwen flex w-full max-w-5xl items-center justify-between gap-2">
          <Link href="/" shallow={true}>
            <Button className="flex items-center gap-2 rounded-full px-4">
              <ArrowLeftIcon strokeWidth={1.5} size={20} />
              <span>Kembali</span>
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div>
              <p className="flex gap-2">
                <CheckIcon className="text-green-500" />
                <span>Tersimpan di Draft</span>
              </p>
            </div>
            <Button
              onClick={openSaveModal}
              className="text-md flex items-center gap-2 rounded-full px-4"
            >
              <SaveIcon strokeWidth={1.5} size={20} />
              <span>Simpan</span>
            </Button>
          </div>
        </div>

        <div className="mt-4 w-full max-w-5xl rounded-xl bg-white p-6">
          {!contentFile ? (
            <ContentFileDropzone
              onFileAccepted={setMainContentFile}
              className="flex h-20 w-full cursor-pointer items-center justify-center rounded-md bg-slate-100"
            />
          ) : (
            <div className="relative flex w-full items-center justify-center">
              <span
                onClick={() => setMainContentFile(null)}
                className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-red-500 p-1 text-white"
              >
                <XIcon strokeWidth={1} />
              </span>
              {contentFile.type === "IMAGE" && (
                <Image
                  src={contentFile.url}
                  alt="Content Image"
                  className="max-h-[500px] w-auto rounded-md"
                  width={100}
                  height={100}
                />
              )}
              {contentFile.type === "VIDEO" && (
                <video
                  src={contentFile.url}
                  controls
                  className="aspect-video w-auto rounded-md"
                />
              )}
            </div>
          )}
          <ArticleEditor
            onValueChange={setTitleAndBody}
            value={titleAndBody}
            className="mt-2"
          />
        </div>
      </div>

      <Modal isOpen={isOpenSaveModal} onClose={closeSaveModal}>
        <h1 className="text-xl">Simpan Pengumuman</h1>

        <div className="mt-2 flex flex-col gap-4">
          {categories && (
            <div>
              <label htmlFor="category" className="mb-2 block text-lg">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
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
                  priority === "PENTING" &&
                    "bg-red-500 text-white hover:bg-red-500",
                )}
                onClick={() => setPriority("PENTING")}
              >
                Penting
              </Button>
              <Button
                className={cn(
                  "flex-1 border-yellow-500 hover:bg-yellow-500/80 hover:text-white",
                  priority === "BIASA" &&
                    "bg-yellow-500 text-white hover:bg-yellow-500",
                )}
                onClick={() => setPriority("BIASA")}
              >
                Biasa
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-lg">
              <label htmlFor="publish-date text-lg">Atur Tanggal Unggah</label>
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer"
                checked={!!publishDate}
                onChange={(e) =>
                  e.target.checked
                    ? setPublishDate(new Date())
                    : setPublishDate(null)
                }
              />
            </div>
            <AnimatePresence>
              {!!publishDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <InputCalender
                    showTimeSelect={true}
                    onChange={(date) => setPublishDate(date)}
                    selected={publishDate}
                    minDate={new Date()}
                    id="publish-date"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Button className="w-full rounded-full">Simpan Draft</Button>

          {session && session.user.role.name === "ADMIN" ? (
            <>
              {!publishDate && (
                <Button
                  className="w-full rounded-full bg-yellow-500 text-white hover:bg-yellow-600 hover:disabled:bg-yellow-500"
                  onClick={() => handleSubmit("publish")}
                >
                  Unggah Sekarang
                </Button>
              )}
            </>
          ) : (
            <Button className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600 hover:disabled:bg-blue-500">
              Minta Persetujuan Admin
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AnnoucementEditor;
