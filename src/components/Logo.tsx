import Link from "next/link";
import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLHeadingElement> {}

const Logo = forwardRef<HTMLHeadingElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <Link href={"/"}>
        <h1
          className={cn(
            "font-rubik-bubbles pointer-events-none select-none text-3xl text-gray-500",
            className,
          )}
          ref={ref}
          {...props}
        >
          School Wall
        </h1>
      </Link>
    );
  },
);

export default Logo;
