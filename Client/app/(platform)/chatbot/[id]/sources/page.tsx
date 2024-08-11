import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Chatbot } from "@/lib/definitions";
import { auth } from "@/auth";
import { getSessionToken } from "@/lib/utils";
import DeleteForm from "@/app/(platform)/chatbot/[id]/sources/_components/form";

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

export default async function SourcesPage({
  params,
}: {
  params: { id: string };
}) {
  const chatbot = await fetchChatBot(params.id);

  return (
    <Card className="w-[1000px] mx-auto">
      <CardHeader>
        <h1>Sources</h1>
      </CardHeader>
      <CardContent>
        <p>This page is a collection of all the sources used in the project.</p>

        <DeleteForm chatbot={chatbot} />
      </CardContent>
    </Card>
  );
}
