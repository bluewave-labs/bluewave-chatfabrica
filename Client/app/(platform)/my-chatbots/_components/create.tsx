"use client";

import { createChatbot } from "@/actions/create-chatbot";
import FormSubmit from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { Plus } from "lucide-react";
import { useRouter } from "next13-progressbar";
import React from "react";
import { toast } from "sonner";

export default function Create() {
  const router = useRouter();

  const { execute } = useAction(createChatbot, {
    onSuccess: (data) => {
      toast.success(
        `Chatbot ${data.name} created successfully. Redirecting to chatbot page...`
      );
      router.push(`/chatbot/${(data as unknown as { _id: string })._id}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  return (
    <form action={execute} className="flex items-center justify-between w-full">
      <h3 className="text-[32px] font-semibold text-slate-700">Chatbots</h3>
      <FormSubmit variant="secondary">
        <Plus size={14} className="mr-1" strokeWidth={3} /> New Chatbot
      </FormSubmit>
    </form>
  );
}
