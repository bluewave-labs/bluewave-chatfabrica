"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { DeleteFile } from "./schema";
import { auth } from "@/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in to delete a chatbot file.",
    };
  }

  let chatbot;

  const { chatbotId, fileIds } = data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/assistants/${chatbotId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          fileIds,
        }),
      }
    );

    chatbot = await response.json();

    if (chatbot.status !== "success") {
      return {
        error: chatbot.message,
      };
    }
  } catch (error) {
    return {
      error: "Chatbot deleted file failed.",
    };
  }

  revalidatePath(`/chatbot/${chatbotId}/sources`);
  return { data: chatbot };
};

export const deleteFile = createSafeAction(DeleteFile, handler);
