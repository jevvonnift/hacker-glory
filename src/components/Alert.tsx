import { forwardRef, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

type Status = "success" | "error" | "warning" | "info";

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  type: Status;
  message: string;
}

export const useAlert = () => {
  const [data, setData] = useState<{
    type: Status;
    message: string;
  } | null>(null);
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (!data) {
      setIsShowing(false);
    } else {
      setIsShowing(true);
      setTimeout(() => {
        setData(null);
      }, 5000);
    }
  }, [data]);

  return { isShowing, data, setData };
};

const Alert = forwardRef<HTMLDivElement, Props>(
  ({ className, type, message, ...props }, ref) => {
    return (
      <div
        className={cn(
          "w-full rounded-md border px-4 py-3 text-white",
          type === "error" && "bg-red-400",
          type === "warning" && "bg-yellow-400 text-black",
          type === "info" && "bg-blue-400",
          type === "success" && "bg-green-400",
          className,
        )}
        ref={ref}
        {...props}
      >
        {message}
      </div>
    );
  },
);

export default Alert;
