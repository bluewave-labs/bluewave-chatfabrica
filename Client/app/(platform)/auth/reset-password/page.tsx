import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { Suspense } from "react";
import ResetForm from "./form";

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[464px] p-5 sm:p-10 gap-y-[35px] sm:gap-y-[10px] flex flex-col">
        <CardHeader className="p-0">
          <CardTitle className="text-black text-[32px] sm:text-[40px] text-center ">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 ">
          <Suspense>
            <ResetForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
