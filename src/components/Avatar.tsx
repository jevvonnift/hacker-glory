import Image from "next/image";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
}

const Avatar = forwardRef<HTMLDivElement, Props>(
  ({ className, width, height, src, alt, ...props }, ref) => {
    return (
      <div
        {...props}
        className={cn(
          "flex h-[150px] w-[150px] items-center justify-center overflow-hidden  rounded-full border",
          className,
        )}
        ref={ref}
      >
        <Image
          src={src ?? "/img/default-user.png"}
          alt={alt}
          width={width ?? 100}
          height={height ?? 100}
          className="w-full"
        />
      </div>
    );
  },
);

export default Avatar;
