import { Card, CardContent } from "@/components/ui/card";
import { Chatbot } from "@/lib/definitions";
import { auth } from "@/auth";
import { getSessionToken } from "@/lib/utils";
import LeftForm from "./left-form";

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

export default async function ChatInterface({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await auth();
  const chatbot = await fetchChatBot(params.id);

  if (!chatbot) {
    return <div>Chatbot not found</div>;
  }

  return (
    <Card className="lg:p-0 max-w-5xl mx-auto">
      <CardContent className="p-5">
        <div className="flex flex-col justify-between lg:flex-row lg:space-x-8">
          <LeftForm chatbot={chatbot} session={session} />
        </div>
      </CardContent>
    </Card>
  );
}
