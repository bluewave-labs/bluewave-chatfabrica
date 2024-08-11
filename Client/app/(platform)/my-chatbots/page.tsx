import React, { Suspense } from "react";

import { auth } from "@/auth";
import { Chatbot } from "@/lib/definitions";
import { cn, getSessionToken } from "@/lib/utils";

import ChatbotCard from "@/components/chatbot-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Create from "./_components/create";
import { Session } from "next-auth";

async function fetchChatBots(session: Session | null): Promise<Chatbot[] | []> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chatbots`,
      {
        headers: {
          Authorization: `Bearer ${getSessionToken(session)}`,
        },
      }
    );
    const chatBots = await response.json();

    if (chatBots.status !== "success") {
      return [];
    }

    return chatBots.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function MyChatBotPage() {
  const session = await auth();
  const chatBots = await fetchChatBots(session);

  return (
    <div className="flex items-center justify-center h-full px-[27px]">
      <Card className="w-[961px] sm:h-[448px] p-5 space-y-7">
        <CardHeader className="sm:flex-row items-center justify-between p-0">
          <Suspense>
            <Create />
          </Suspense>
        </CardHeader>
        <CardContent
          className={cn(
            "grid grid-cols-1 place-items-center sm:place-items-baseline sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-0",
            {
              "grid-cols-1": !chatBots.length,
            }
          )}
        >
          {chatBots.length ? (
            chatBots.map((chatbot) => (
              <Suspense key={chatbot.id}>
                <ChatbotCard
                  id={chatbot.id}
                  title={chatbot.name}
                  assistantId={chatbot.assistantId}
                  model={chatbot.model}
                />
              </Suspense>
            ))
          ) : (
            <p className="text-black text-base w-full text-center">
              No chatbots found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
