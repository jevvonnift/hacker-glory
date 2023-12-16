import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { type HTMLAttributes, forwardRef, useEffect } from "react";
import { cn } from "~/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  showCloseIcon?: boolean;
}

const Modal = forwardRef<HTMLDivElement, Props>(
  ({ className, isOpen, showCloseIcon = true, onClose, ...props }, ref) => {
    useEffect(() => {
      if (isOpen) document.body.style.overflow = "hidden";
      if (!isOpen) document.body.style.overflow = "unset";
    }, [isOpen]);

    return (
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed inset-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none"
            >
              <div
                ref={ref}
                className={cn(
                  "relative flex w-full max-w-md flex-auto flex-col rounded-xl border-0 bg-white p-6 shadow-lg outline-none focus:outline-none",
                  className,
                )}
              >
                {showCloseIcon && (
                  <span
                    className="absolute right-4 top-4 cursor-pointer"
                    onClick={onClose}
                  >
                    <XIcon
                      strokeWidth={1.2}
                      className="text-slate-500 transition-all hover:text-slate-600"
                    />
                  </span>
                )}

                {props.children}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black opacity-25"
            />
          </>
        ) : null}
      </AnimatePresence>
    );
  },
);

export default Modal;
