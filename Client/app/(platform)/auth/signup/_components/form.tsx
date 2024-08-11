"use client";

import { createUser } from "@/actions/create-user";
import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { useRouter } from "next13-progressbar";
import React from "react";
import { toast } from "sonner";

export default function SignUpForm() {
  const router = useRouter();

  const { execute, fieldErrors } = useAction(createUser, {
    onSuccess: (data) => {
      toast.success("Account created successfully");
      router.push("/auth/signin");
    },
    onError: (error) => {
      if (error === "PrismaClientKnownRequestError") {
        toast.error("Email already exists");
      } else {
        toast.error(error);
      }
    },
  });

  const onSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    execute({
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <form action={onSubmit} className="space-y-5">
      <FormInput
        id="email"
        label="Email"
        placeholder="Email"
        errors={fieldErrors}
      />
      <FormInput
        id="password"
        label="Password"
        placeholder="Password"
        type="password"
        errors={fieldErrors}
      />
      <FormInput
        id="confirmPassword"
        label="Password"
        placeholder="Password"
        type="password"
        errors={fieldErrors}
      />
      <FormSubmit className="w-full">Sign Up</FormSubmit>
    </form>
  );
}
