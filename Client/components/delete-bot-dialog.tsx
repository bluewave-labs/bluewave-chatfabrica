"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Trash2 } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { useAction } from "@/hooks/use-action";
import FormSubmit from "./form/form-submit";
import { deleteChatbot } from "@/actions/delete-chatbot";
import { toast } from "sonner";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next13-progressbar";

export default function DeleteBotDialog() {
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();
  const [chatbotId, setChatbotId] = useState<string>("");

  const { execute } = useAction(deleteChatbot, {
    onSuccess: () => {
      toast.success("Chatbot deleted successfully.");
      router.replace("/my-chatbots");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = async () => {
    execute({
      chatbotId: chatbotId as string,
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const chatbotId = localStorage.getItem("selectedChatbot")
        ? localStorage.getItem("selectedChatbot")
        : "";
      setChatbotId(chatbotId as string);
    }
  }, []);

  if (pathname === `/chatbot/${id}/profile`) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger className="flex items-center w-56 h-11 gap-x-2.5 px-3 hover:bg-slate-100 rounded-lg text-sm font-medium">
        <Trash2 />
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Are you sure you want to delete your chatbot?
        </DialogTitle>
        <DialogDescription className="text-sm text-slate-500">
          This action cannot be undone.
        </DialogDescription>
        <DialogFooter className="flex items-center justify-end gap-y-2">
          <DialogClose
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:w-auto",
            })}
          >
            Cancel
          </DialogClose>
          <form action={onSubmit} className="w-full sm:w-auto">
            <FormSubmit className="w-full sm:w-auto" variant="destructive">
              Delete
            </FormSubmit>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
