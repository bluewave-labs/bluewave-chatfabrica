import React from "react";
import Sources from "./_components/sources";
import { Card } from "@/components/ui/card";
import TrainForm from "./_components/train";
import { Chatbot, Plan, User, UserPlan } from "@/lib/definitions";
import { auth } from "@/auth";
import TextForm from "./_components/text";
import WebsiteForm from "./_components/website";
import { getSessionToken } from "@/lib/utils";

async function fetchUser(): Promise<User | null> {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${getSessionToken(session)}`,
        },
      }
    );
    const user = await response.json();

    if (user.status !== "success") {
      return null;
    }

    return user.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function activePlan(): Promise<UserPlan[] | null> {
  try {
    const session = await auth();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/active-plan`,
      {
        headers: {
          Authorization: `Bearer ${getSessionToken(session)}`,
        },
      }
    );
    const plan = await response.json();

    if (plan.status !== "success") {
      return null;
    }

    return plan.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

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

export default async function TrainPage({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    "data-source": string;
  };
}) {
  const session = await auth();
  const user = await fetchUser();
  const chatbot = await fetchChatBot(id as string);
  const activeUserPlan = await activePlan();

  const getDataSource = () => {
    switch (searchParams?.["data-source"]) {
      case "files":
        return {
          title: "Files",
          component: <TrainForm chatbot={chatbot} session={session} />,
        };
      case "text":
        return {
          title: "Text",
          component: <TextForm />,
        };
      case "website":
        return {
          title: "Website",
          component: <WebsiteForm chatbot={chatbot} session={session} />,
        };
      default:
        return {
          title: "Files",
          component: <TrainForm chatbot={chatbot} session={session} />,
        };
    }
  };

  return (
    <Card className="min-h-screen flex-col justify-center w-full lg:w-[961px] mx-auto p-10">
      <Sources user={user!} activeUserPlan={activeUserPlan} chatbot={chatbot} />
      {getDataSource().component}
    </Card>
  );
}
