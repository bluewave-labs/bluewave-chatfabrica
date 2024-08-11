"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { SaveApiKey } from "./schema";
import { auth } from "@/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  let result;

  try {
    const session = await auth();
    let response;
    if (!session?.user) {
      return {
        error: "You must be logged in to crawl a website.",
      };
    }

    response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api-key`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ apiKey: data.apiKey }),
      }
    );

    result = await response.json();
    if (!response.ok) {
      return {
        error: "An error occurred while crawling the website.",
      };
    }
  } catch (error) {
    console.error("Error while sending API key:", error);
    return {
      error: "An error occurred while crawling the website.",
    };
  }
  revalidatePath(`/profile`);
  return { data: result };
};

export const saveApiKey = createSafeAction(SaveApiKey, handler);
