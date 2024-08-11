import React from "react";
import ChatCard from "./_components/chat-card";
import { Chatbot } from "@/lib/definitions";
import { auth } from "@/auth";
import { getSessionToken } from "@/lib/utils";

async function fetchChatBot(id: string): Promise<Chatbot | null> {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chatbots/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getSessionToken(session)}`,
        },
      }
    );
    const chatbot = await response.json();

    if (chatbot.status !== "success") {
      return null;
    }

    return chatbot.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ChatbotIdPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const chatbot = await fetchChatBot(params.id);

  if (!chatbot) {
    return <div>Chatbot not found</div>;
  }

  return (
    <div className="flex justify-center">
      <ChatCard chatbot={chatbot} />
    </div>
  );
}
