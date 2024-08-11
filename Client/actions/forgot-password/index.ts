"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { ForgotPassword } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { email } = data;

  let chatbot;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
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

  revalidatePath(`/auth/forgotPassword`);
  return { data: chatbot };
};

export const forgotPassword = createSafeAction(ForgotPassword, handler);
