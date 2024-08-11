"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { TrainChatbot } from "./schema";
import { auth } from "@/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in to train a chatbot.",
    };
  }

  let chatbot;

  const { files, links, text, assistantId, chatbotId } = data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/assistants/${assistantId}/train`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          files,
          links,
          text,
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
      error: "Chatbot training failed.",
    };
  }

  revalidatePath(`/chatbot/${chatbot.id}`);
  return { data: chatbot };
};

export const trainChatbot = createSafeAction(TrainChatbot, handler);
