import { forwardRef } from "react";
import { cn } from "~/lib/utils";

type Status = "success" | "error" | "warning" | "info" | "default";

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  type?: Status;
}

const Badge = forwardRef<HTMLDivElement, Props>(
  ({ className, type = "default", ...props }, ref) => {
    return (
      <div
        className={cn(
          "rounded-full border px-4 py-2 text-black",
          type === "error" && "border-red-400",
          type === "warning" && "border-yellow-400",
          type === "info" && "border-blue-400",
          type === "success" && "border-green-400",
          type === "default" && "border-gray-400",
          className,
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </div>
    );
  },
);

export default Badge;
