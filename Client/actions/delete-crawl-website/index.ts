"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { DeleteCrawlWebsite } from "./schema";
import { auth } from "@/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth();

  if (!session?.user) {
    return {
      error: "You must be logged in to crawl a website.",
    };
  }

  const { chatbotId, fileId } = data;

  let chatbot;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/crawl-website/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          chatbotId,
          fileId,
        }),
      }
    );

    chatbot = await response.json();
  } catch (error) {
    return {
      error: "An error occurred while crawling the website.",
    };
  }

  revalidatePath(`/chatbot/${chatbot.id}/train?data-source=website`);
  return { data: chatbot };
};

export const deleteCrawlWebsite = createSafeAction(DeleteCrawlWebsite, handler);
