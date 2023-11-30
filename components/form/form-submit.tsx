"use client";

import {useFormStatus} from "react-dom";
import {cn} from "@/lib/utils";
import {Button} from "../ui/button";

type Props = {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "primary";
};
function FormSubmit({
  children,
  disabled,
  className,
  variant = "primary",
}: Props) {
  const {pending} = useFormStatus();

  return (
    <Button
      disabled={pending || disabled}
      type="submit"
      variant={variant}
      size={"sm"}
      className={cn(className)}
    >
      {children}
    </Button>
  );
}

export default FormSubmit;
