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
            "font-rubik-bubbles select-none  text-3xl  text-yellow-400 transition-all",
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
