"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { UpdateChatbot } from "./schema";
import { auth } from "@/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in to update a chatbot.",
    };
  }

  let chatbot;

  const { assistantId, model, description, name, visibility, temperature } =
    data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/assistants/${assistantId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          model,
          description,
          name,
          visibility,
          temperature,
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
      error: "Chatbot updated failed.",
    };
  }

  revalidatePath(`/chatbot/${chatbot.id}/settings/model`);
  return { data: chatbot };
};

export const updateChatbot = createSafeAction(UpdateChatbot, handler);
