import {KeyboardEventHandler, forwardRef} from "react";
import {Label} from "../ui/label";
import {Textarea} from "../ui/textarea";
import {cn} from "@/lib/utils";
import {FormErrors} from "./form-errors";
import {useFormStatus} from "react-dom";

type Props = {
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[]> | undefined;
  className?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeydown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  defaultValue?: string;
};

export const FormTextArea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled,
      errors,
      className,
      onBlur,
      onClick,
      onKeydown,
      defaultValue,
    },
    ref
  ) => {
    const {pending} = useFormStatus();
    return (
      <div className="space-y-2 w-full">
        <div className="space=y-1 w-full">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Textarea
            onKeyDown={onKeydown}
            onBlur={onBlur}
            required={required}
            ref={ref}
            onClick={onClick}
            placeholder={placeholder}
            name={id}
            id={id}
            disabled={disabled || pending}
            className={cn(
              `resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 outline-none shadow-sm`,
              className
            )}
            aria-describedby={`${id}-error`}
            defaultValue={defaultValue}
          />
        </div>
        {/* @ts-ignore */}
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

FormTextArea.displayName = "FormTextArea";
