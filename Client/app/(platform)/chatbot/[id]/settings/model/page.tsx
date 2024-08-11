import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import ModelForm from "./_components/form";
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

export default async function ModelPage({
  params,
}: {
  params: { id: string };
}) {
  const chatbot = await fetchChatBot(params.id);

  if (!chatbot) {
    return <div>Chatbot not found</div>;
  }

  return (
    <Card className="lg:p-0 lg:w-[961px] mx-auto">
      <CardContent className="p-10">
        <ModelForm chatbot={chatbot} />
      </CardContent>
    </Card>
  );
}
