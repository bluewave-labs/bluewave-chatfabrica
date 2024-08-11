import Image from "next/image";
import React from "react";

import { Chatbot } from "@/lib/definitions";
import { auth } from "@/auth";
import { getSessionToken } from "@/lib/utils";
import Hamburger from "./hamburger";
import HeaderCollapsible from "./header-collapsible";
import Account from "./account";
import Link from "next/link";

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

export default async function Header() {
  const chatBots = await fetchChatBots();
  const session = await auth();

  return (
    <header className="w-full h-20 bg-white flex items-center justify-between pr-6 pl-6 md:pl-[27px] shadow-md ">
      <Hamburger />
      <Link href="/my-chatbots" className="gap-x-[34px] hidden md:flex">
        <Image
          src={"/images/logoheader.png"}
          alt="CF"
          width={48}
          height={48}
          className="w-[48px] h-[48px]"
        />
        {/* <h3 className="text-2xl font-semibold text-slate-700 mt-1.5">
          Chatbot
        </h3> */}
      </Link>
      <HeaderCollapsible chatBots={chatBots} />
      <Account name={session?.user.name} />
    </header>
  );
}
