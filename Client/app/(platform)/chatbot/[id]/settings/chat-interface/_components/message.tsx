"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MessageList from "./message-list";

export type Message = {
  id: string;
  body: string;
  date: Date;
  role: "assistant" | "user";
  from: string;
};

export default function Message({
  customize: {
    initialMessage,
    chatSuggestions,
    placeholder,
    color,
    profilePicture,
    buttonColor,
    iconMessage,
  },
}: {
  customize: {
    initialMessage: string;
    chatSuggestions: string[] | null;
    placeholder: string | null;
    color: string;
    profilePicture: string;
    buttonColor: string;
    iconMessage: string;
  };
}) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (initialMessage === "") {
      setMessages([]);
      return;
    }

    setMessages([
      {
        id: Math.random().toString(36),
        body: initialMessage,
        date: new Date(),
        role: "assistant",
        from: "CF",
      },
      {
        id: Math.random().toString(36),
        body: initialMessage,
        date: new Date(),
        role: "user",
        from: "CF",
      },
    ]);
  }, [initialMessage]);

  return (
    <>
      <MessageList
        messages={messages}
        customize={{
          initialMessage,
          chatSuggestions,
          placeholder,
          color,
          profilePicture,
        }}
      />
      <div className="flex overflow-x-auto items-center gap-2">
        {chatSuggestions && chatSuggestions.length > 0
          ? chatSuggestions
              ?.filter((value) => value !== "")
              .map((suggestion, index) => (
                <div
                  key={suggestion + index}
                  className="border w-fit shrink-0 border-slate-200 text-xs py-2 px-4 rounded-[6px] cursor-pointer text-[#0F172A] font-medium"
                >
                  {suggestion}
                </div>
              ))
          : null}
      </div>
      <form className="mt-5 space-y-2">
        <div className=" w-full h-[80px]">
          <Textarea
            id="message"
            name="message"
            placeholder={placeholder || ""}
            className="resize-none"
          />
        </div>
        <Button
          disabled={true}
          type="submit"
          className="w-full"
          style={{ backgroundColor: buttonColor }}
        >
          {iconMessage}
        </Button>
      </form>
    </>
  );
}
