import { forwardRef } from "react";
import { cn } from "~/lib/utils";
import DatePicker, {
  registerLocale,
  type ReactDatePicker,
  type ReactDatePickerProps,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import Button from "./Button";

registerLocale("id", id);

interface Props extends ReactDatePickerProps {
  formatDateOption?: Intl.DateTimeFormatOptions;
}

const InputCalender = forwardRef<ReactDatePicker, Props>(
  ({ className, formatDateOption, ...props }, ref) => {
    return (
      <DatePicker
        {...props}
        className={cn(
          "w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500",
          className,
        )}
        locale="id"
        customInput={
          <Button>
            {props.selected?.toLocaleDateString(
              "id",
              formatDateOption ?? {
                hour12: false,
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            ) ?? ""}
          </Button>
        }
        ref={ref}
      />
    );
  },
);

export default InputCalender;
