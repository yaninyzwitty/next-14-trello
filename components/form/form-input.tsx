"use client";

import {cn} from "@/lib/utils";
import {forwardRef} from "react";
import {useFormStatus} from "react-dom";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {FormErrors} from "./form-errors";

type Props = {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
};

const FormInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      type,
      placeholder,
      required,
      disabled,
      errors,
      className,
      defaultValue = "",
      onBlur,
    },
    ref
  ) => {
    const {pending} = useFormStatus();

    return (
      <div className="space-y-2 ">
        <div className="space-y-1">
          {label ? (
            <>
              <Label
                htmlFor={id}
                className="text-xs font-semibold text-neutral-700"
              >
                {label}
              </Label>
            </>
          ) : null}
          <Input
            onBlur={onBlur}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            name={id}
            placeholder={placeholder}
            type={type}
            disabled={pending || disabled}
            className={cn(`text-sm px-2 py-1 h-7`, className)}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

export default FormInput;

FormInput.displayName = "FormInput";
