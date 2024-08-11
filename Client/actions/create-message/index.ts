"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CreateMessage } from "./schema";
import { auth } from "@/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in to create a message.",
    };
  }

  const { assistantId, message, threadId, chatbotId } = data;

  let chatbot;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
        threadId ? "chatbot-message" : "chatbot-first-message"
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
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

export const createMessage = createSafeAction(CreateMessage, handler);
