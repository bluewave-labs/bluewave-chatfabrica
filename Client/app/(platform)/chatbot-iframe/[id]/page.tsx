import { Chatbot } from "@/lib/definitions";
import React from "react";
import IframeMessageForm from "./_components/form";

async function fetchChatBot(id: string): Promise<Chatbot | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/iframe/chatbots/${id}`,
      {
        cache: "no-cache",
      }
    );
    const chatbot = await response.json();

    return chatbot;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ChatbotIframe({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const chatbot = await fetchChatBot(params.id);

  if (!chatbot) {
    return (
      <div className="h-full flex items-center justify-center font-bold">
        Chatbot not found
      </div>
    );
  }

  return (
    <div className="h-screen">
      <IframeMessageForm chatbot={chatbot} />
    </div>
  );
}
