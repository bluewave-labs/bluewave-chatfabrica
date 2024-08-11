"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { CustomizeChatbot } from "./schema";
import { auth } from "@/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in to create a chatbot.",
    };
  }

  const {
    id,
    initialMessage,
    chatSuggestions,
    displayName,
    placeholder,
    alignButton,
    initialMessageShowTime,
    chatBubbleButtonColor,
    messageColor,
    iconMessage,
    chatIcon,
  } = data;

  let chatbot;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chatbots/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          initialMessageShowTime,
          messagePlaceholder: placeholder,
          displayName,
          initialMessage,
          chatSuggestions,
          alignButton,
          chatBubbleButtonColor,
          messageColor,
          iconMessage,
          chatIcon,
        }),
      }
    );

    chatbot = await response.json();

    if (!chatbot) {
      return {
        error: chatbot.message,
      };
    }
  } catch (error) {
    return {
      error: "Chatbot updated failed.",
    };
  }

  revalidatePath(`/chatbot/${chatbot.id}/settings/chat-interface`);
  return { data: chatbot };
};

export const customizeChatbot = createSafeAction(CustomizeChatbot, handler);
