import { forwardRef } from "react";
import { cn } from "~/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:border-slate-300 focus-visible:outline-none",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

export default Input;
