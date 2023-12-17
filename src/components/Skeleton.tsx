import { type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-300", className)}
      {...props}
    />
  );
};

export default Skeleton;
