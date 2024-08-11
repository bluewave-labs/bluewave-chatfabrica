"use client";

import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { authenticate } from "@/lib/action-auth";
import Link from "next/link";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export default function SignInForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  });

  return (
    <form action={dispatch} className="space-y-5">
      <FormInput id="email" label="Email" placeholder="Email" />
      <FormInput
        id="password"
        label="Password"
        placeholder="Password"
        type="password"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Checkbox id="remember" />
          <Label className="text-sm text-black" htmlFor="remember">
            Remember Me
          </Label>
        </div>
        <Link href="/auth/forgotPassword" className="text-indigo-600 text-sm font-medium">
          Forgot password?
        </Link>
      </div>
      <FormSubmit className="w-full">Sign In</FormSubmit>
    </form>
  );
}
