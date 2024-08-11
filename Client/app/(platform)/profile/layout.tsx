import { auth } from "@/auth";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import SidebarMobile from "@/components/ui/sidebar-mobile";
import { Chatbot } from "@/lib/definitions";
import { getSessionToken } from "@/lib/utils";
import React from "react";

async function fetchChatBots(): Promise<Chatbot[] | []> {
  try {
    const session = await auth();
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

export default async function ChatBotIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chatbot = await fetchChatBots();

  return (
    <div>
      <Header />
      <div className="flex h-full flex-col md:flex-row md:overflow-hidden mt-[30px]">
        <div className="hidden md:flex md:flex-none md:fixed md:w-[254px]">
          <Sidebar id={chatbot[0]?.id} />
        </div>
        <SidebarMobile>
          <Sidebar id={chatbot[0]?.id} className="h-full" />
        </SidebarMobile>
        <div className="flex-grow md:overflow-y-auto p-6 lg:p-0 lg:pt-[22px]">
          {children}
        </div>
      </div>
    </div>
  );
}
