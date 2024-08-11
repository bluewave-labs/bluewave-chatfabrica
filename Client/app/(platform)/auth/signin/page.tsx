import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import SignInForm from "./_components/form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[464px] p-5 sm:p-10 gap-y-[35px] sm:gap-y-[75px] flex flex-col">
        <CardHeader className="p-0">
          <CardTitle className="text-black text-[32px] sm:text-[40px] text-center ">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-7">
          <SignInForm />
          <div className="flex items-center justify-center space-x-1">
            <span className="text-sm text-slate-400">
              Don’ have an account?
            </span>
            <Link
              href="/auth/signup"
              className="text-sm font-medium text-indigo-600"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
