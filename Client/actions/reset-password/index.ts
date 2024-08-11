"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { ResetPassword } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { token, password } = data;

  let chatbot;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
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
      error: "Something went wrong",
    };
  }

  revalidatePath(`/auth/reset-password`);
  return { data: chatbot };
};

export const resetPassword = createSafeAction(ResetPassword, handler);
