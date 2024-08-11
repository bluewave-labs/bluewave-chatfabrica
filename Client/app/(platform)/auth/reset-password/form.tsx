"use client";

import { resetPassword } from "@/actions/reset-password";
import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import {  useSearchParams } from "next/navigation";
import { useRouter } from "next13-progressbar";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { execute, fieldErrors } = useAction(resetPassword, {
    onSuccess: () => {
      toast.success("Password reset successfully.");
      router.push("/auth/signin");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const dispatch = (formData: FormData) => {
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    execute({
      password,
      token: token as string,
    });
  };

  useEffect(() => {
    if (!token) {
      toast.error("Invalid token");
      router.push("/auth/forgot-password");
    }
  }, [token, router]);

  return (
    <form action={dispatch} className="space-y-5">
      <FormInput
        id="password"
        label="Password"
        placeholder="Password"
        errors={fieldErrors}
        type="password"
      />
      <FormInput
        id="passwordConfirm"
        label="Confirm Password"
        placeholder="Confirm Password"
        errors={fieldErrors}
        type="password"
      />
      <FormSubmit className="w-full">Reset Password</FormSubmit>
    </form>
  );
}
