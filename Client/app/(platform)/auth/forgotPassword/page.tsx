import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import SignInForm from "./_components/form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[464px] p-5 sm:p-10 gap-y-[35px] sm:gap-y-[10px] flex flex-col">
        <CardHeader className="p-0">
          <CardTitle className="text-black text-[32px] sm:text-[40px] text-center ">
            Forgot Password
          </CardTitle>
          <div className="w-full flex justify-center">
            <span className="flex  justify-center text-center text-stone-400  text-sm">
              No worries,we'll send you reset instructions
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 ">
          <SignInForm />
          <div className="flex items-center justify-center mt-2">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-indigo-600 mt-2"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
