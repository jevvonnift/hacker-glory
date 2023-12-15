import { type AnnouncementPriority } from "@prisma/client";
import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  priority: AnnouncementPriority;
}

const AnnouncementPriorityBadge = forwardRef<HTMLSpanElement, Props>(
  ({ priority, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "rounded-full px-4 py-2 text-white",
          priority === "BIASA" ? "bg-yellow-500" : "bg-red-500",
          className,
        )}
        {...props}
      >
        {priority}
      </span>
    );
  },
);

export default AnnouncementPriorityBadge;
