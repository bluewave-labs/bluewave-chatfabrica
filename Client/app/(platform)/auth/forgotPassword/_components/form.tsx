"use client";

import { forgotPassword } from "@/actions/forgot-password";
import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";

import React, { useRef } from "react";
import { toast } from "sonner";

export default function SignInForm() {
  const ref = useRef<HTMLFormElement>(null);

  const { execute, fieldErrors } = useAction(forgotPassword, {
    onSuccess: () => {
      toast.success("Password reset email sent");
      ref.current?.reset();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const dispatch = (formData: FormData) => {
    const email = formData.get("email") as string;

    execute({
      email,
    });
  };

  return (
    <form ref={ref} action={dispatch} className="space-y-5">
      <FormInput
        id="email"
        label="Email"
        placeholder="Email"
        errors={fieldErrors}
      />
      <FormSubmit className="w-full">Reset Password</FormSubmit>
    </form>
  );
}
