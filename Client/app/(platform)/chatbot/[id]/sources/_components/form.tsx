"use client";

import React, { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Chatbot } from "@/lib/definitions";
import { useAction } from "@/hooks/use-action";
import { deleteFile } from "../../../../../../actions/delete-files";
import { toast } from "sonner";

export default function DeleteForm({ chatbot }: { chatbot: Chatbot | null }) {
  const { execute, isLoading } = useAction(deleteFile, {
    onSuccess: () => {
      toast.success("File deleted");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const fileIds = formData.get("fileIds") as string;

    if (!fileIds) {
      return;
    }

    execute({
      chatbotId: chatbot!.id,
      fileIds: [fileIds],
    });
  };

  return (
    <form action={onSubmit}>
      <ul className="mt-4 gap-y-4">
        {chatbot?.files?.map((file) => (
          <Fragment key={file.id}>
            <input type="hidden" value={file.id} name="fileIds" id="fileIds" />
            <li className="flex items-center justify-between">
              {file.name}
              <Button disabled={isLoading} variant="ghost">
                <Trash size={18} />
              </Button>
            </li>
          </Fragment>
        ))}
      </ul>
    </form>
  );
}
