import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "rounded-md border p-2 hover:bg-slate-100 disabled:opacity-80 hover:disabled:opacity-80",
          className,
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </button>
    );
  },
);

export default Button;
