"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import type { RouterOutputs } from "~/trpc/shared";
import Avatar from "../Avatar";
import useSession from "~/hooks/useSession";
import { formatDistanceToNowStrict } from "date-fns";
import id from "date-fns/locale/id";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

type Comment = RouterOutputs["comment"]["getAll"][number];

interface Props extends HTMLAttributes<HTMLDivElement> {
  comment: Comment;
  onReply?: (comment: Comment) => void;
}

const CommentCard = forwardRef<HTMLDivElement, Props>(
  ({ className, comment, onReply, ...props }, ref) => {
    const { session } = useSession();
    const context = api.useUtils();

    const { mutate: deleteComment } = api.comment.delete.useMutation();

    const handleDelete = () => {
      if (!session) return;

      deleteComment(
        {
          id: comment.id,
        },
        {
          async onSuccess() {
            toast.success("Berhasil menghapus komentar.");
            await context.comment.invalidate();
          },
          onError() {
            toast.error("Gagal menghapus komentar.");
          },
        },
      );
    };

    return (
      <div className={cn("w-full py-2", className)} ref={ref} {...props}>
        {comment.repliedTo && (
          <div className="ml-3 flex">
            <div className="w-5">
              <div className="mt-4 h-5 w-5 rounded-tl-xl border-2 border-b-0 border-r-0 border-gray-500" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <Avatar
                  src={comment.repliedTo.user.image}
                  alt={comment.repliedTo.user.username}
                  className="h-6 w-6"
                />
              </div>
              <span className="text-sm font-medium">
                {comment.repliedTo.user.username}
              </span>
              <p className="line-clamp-1 select-none text-sm">
                {comment.repliedTo.body}
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <div>
            <Avatar
              src={comment.user.image}
              alt={comment.user.username}
              className="h-8 w-8"
            />
          </div>
          <div>
            <span className="font-medium">{comment.user.username}</span>
            <span className="ml-2 text-sm text-slate-500">
              {formatDistanceToNowStrict(comment.createdAt, {
                addSuffix: true,
                locale: id,
              })}
            </span>

            <p className="text-md whitespace-pre-wrap">{comment.body}</p>

            {session && (
              <div className="mt-2 flex gap-2">
                <span
                  className="cursor-pointer text-sm font-medium text-slate-500"
                  onClick={() => onReply?.(comment)}
                >
                  Reply
                </span>

                {comment.user.id === session.user.id && (
                  <span
                    onClick={handleDelete}
                    className="cursor-pointer text-sm font-medium text-slate-500"
                  >
                    Delete
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default CommentCard;
