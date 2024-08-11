import React from "react";

import Status from "../../../../../components/status";
import ChatCardItem from "./chat-card-item";
import Message from "./message";
import { auth } from "@/auth";
import { Chatbot } from "@/lib/definitions";
import moment from "moment";


export default async function ChatCard({ chatbot }: { chatbot: Chatbot }) {
  const session = await auth();

  // totalCharacterCount hesaplaması
  const fileChars =
    chatbot.files?.reduce((acc, file) => acc + +file.characterCount, 0) || 0;

  const textChars =
    chatbot.files?.reduce(
      (acc, file) => (file.type === "text" ? acc + +file.characterCount : acc),
      0
    ) || 0;

  const linkChars =
    chatbot.trainingDatas?.reduce(
      (acc, link) => acc + +link.charactersCount,
      0
    ) || 0;

  const totalCharacterCount = fileChars + textChars + linkChars;
  return (
    <div className="w-full lg:w-[1000px]  2xl:ml-auto mx-auto px-5 py-10 bg-white rounded-[16px] shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-5 md:place-items-center gap-y-4">
        <Status value={chatbot.status} />
        <ChatCardItem label="Model" value={chatbot.model} />
        <ChatCardItem label="Number of characters" value={Intl.NumberFormat("en-US").format(totalCharacterCount)} />
        <ChatCardItem label="Visibility" value={chatbot.visibility} />
        <ChatCardItem
          label="Last train at"
          value={moment(chatbot.lastTrainAt).format("MMMM Do YYYY")}
        />
      </div>
      <hr className="mt-10" />
      
      <Message user={session?.user!} chatbot={chatbot} session={session} />
    </div>
  );
}
