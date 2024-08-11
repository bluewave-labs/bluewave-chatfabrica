"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CreateMessage } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { assistantId, message, threadId, chatbotId } = data;

  let chatbot;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/iframe/chatbots/${chatbotId}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId,
          message,
          threadId,
          chatbotId,
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
      error: "Something went wrong while creating the message.",
    };
  }

  revalidatePath(`/chatbot/${chatbot.id}`);
  return { data: chatbot };
};

export const iframeMessage = createSafeAction(CreateMessage, handler);
