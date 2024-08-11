"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { DeleteChatbot } from "./schema";
import { auth } from "@/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in to delete a chatbot.",
    };
  }

  let chatbot;

  const { chatbotId } = data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/assistants/${chatbotId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
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
      error: "Chatbot deleted failed.",
    };
  }

  revalidatePath(`/my-chatbots`);
  return { data: chatbot };
};

export const deleteChatbot = createSafeAction(DeleteChatbot, handler);
