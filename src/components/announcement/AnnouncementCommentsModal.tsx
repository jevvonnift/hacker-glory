"use client";

import { Loader2Icon, SendHorizontalIcon, XIcon } from "lucide-react";
import Button from "../Button";
import Modal from "../Modal";
import { api } from "~/trpc/react";
import TextareaAutoSize from "react-textarea-autosize";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import CommentCard from "../comment/CommentCard";
import type { RouterOutputs } from "~/trpc/shared";
import Avatar from "../Avatar";
import { AnimatePresence, motion } from "framer-motion";
import useSession from "~/hooks/useSession";
import Link from "next/link";

type Props = {
  announcementId: string;
  isOpen: boolean;
  onClose: () => void;
};

type Comment = RouterOutputs["comment"]["getAll"][number];

const AnnouncementCommentsModal = ({ announcementId, ...props }: Props) => {
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRepliedTo, setIsRepliedTo] = useState<Comment | null>(null);
  const lastCommentRef = useRef<HTMLDivElement | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const { session } = useSession();

  const {
    data: comments,
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = api.comment.getAll.useQuery({
    announcementId,
  });

  const scrollCommentToBottom = () =>
    lastCommentRef?.current?.scrollIntoView({
      behavior: "smooth",
    });

  const { mutate: createComment } = api.comment.create.useMutation();

  const handleSubmitComment = () => {
    const body = commentInput.trimStart().trimEnd();
    if (body === "") return toast.error("Isi komentar kamu terlebih dahulu!");
    setIsSubmitting(true);
    createComment(
      {
        announcementId,
        body,
        repliedToId: isRepliedTo ? isRepliedTo.id : undefined,
      },
      {
        async onSuccess() {
          await refetchComments();
          setIsSubmitting(false);
          setCommentInput("");
          setIsRepliedTo(null);
          scrollCommentToBottom();
        },
        onError() {
          toast.error("Gagal menambahkan komentar!");
        },
      },
    );
  };

  useEffect(() => {
    if (isRepliedTo) {
      commentInputRef?.current?.focus();
    }
  }, [isRepliedTo]);

  return (
    <Modal {...props} className="h-[80vh]">
      <div className="mt-2 flex h-full flex-col gap-2">
        <h1 className="text-lg">Komentar</h1>
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {isLoadingComments && (
            <div className="flex h-full items-center justify-center">
              <Loader2Icon className="animate-spin" />
            </div>
          )}
          {!comments?.length && !isLoadingComments && (
            <div className="flex h-full items-center justify-center">
              <p>Belum ada diskusi. Jadilah yang pertama!</p>
            </div>
          )}

          {comments &&
            comments?.map((comment, idx) => (
              <div className="flex flex-col gap-2 px-2">
                <CommentCard
                  comment={comment}
                  onReply={setIsRepliedTo}
                  ref={idx === comments.length - 1 ? lastCommentRef : undefined}
                />
              </div>
            ))}
        </div>

        <div className="min-h-12 flex flex-col items-end gap-2">
          <AnimatePresence>
            {isRepliedTo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className="flex gap-2 rounded-md border p-2">
                  <div className="h-8 w-8">
                    <Avatar
                      src={isRepliedTo.user.image}
                      alt={isRepliedTo.user.username}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div>
                      <span className="italic text-gray-500">Membalas</span>{" "}
                      <span className="font-medium">
                        {" "}
                        {isRepliedTo.user.username}{" "}
                      </span>
                    </div>
                    <p className="text-md line-clamp-1">{isRepliedTo.body}</p>
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={() => setIsRepliedTo(null)}
                  >
                    <XIcon
                      strokeWidth={1.2}
                      className="text-slate-500 transition-all hover:text-slate-600"
                    />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {session ? (
            <div className="flex w-full items-end justify-between gap-2">
              <TextareaAutoSize
                placeholder="Tulis komentar..."
                className="placeholder:text-muted-foreground flex h-10 w-full resize-none rounded-md border px-3 py-2 focus-visible:border-slate-300 focus-visible:outline-none disabled:opacity-80"
                maxRows={3}
                value={commentInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                disabled={isSubmitting}
                onChange={(e) => setCommentInput(e.target.value)}
                ref={commentInputRef}
              />
              <Button
                className="h-max w-max rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 hover:disabled:bg-blue-500"
                onClick={handleSubmitComment}
                disabled={isSubmitting}
              >
                <SendHorizontalIcon />
              </Button>
            </div>
          ) : (
            <Link href="/login" className="w-full">
              <Button className="w-full">Masuk Untuk Berkomentar</Button>
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AnnouncementCommentsModal;
