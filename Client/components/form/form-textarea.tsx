"use client";

import { KeyboardEventHandler, forwardRef } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import FormErrors from "./form-errors";
import { useFormStatus } from "react-dom";

interface FormTextAreaProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  onClick?: () => void;
  onBlur?: () => void;
}

const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled,
      errors,
      className,
      defaultValue,
      onKeyDown,
      onClick,
      onBlur,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2 w-full">
        <div className="space-y-2 w-full">
          {label ? (
            <Label
              htmlFor={id}
              className="text-sm font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Textarea
            id={id}
            name={id}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className={cn(
              "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
              className
            )}
            aria-describedby={`${id}-error`}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            ref={ref}
            disabled={disabled || pending}
            required={required}
          />
        </div>
        <FormErrors errors={errors} id={id} />
      </div>
    );
  }
);

FormTextArea.displayName = "FormTextArea";

export default FormTextArea;
