"use client";
import React, { useEffect, useRef } from "react";
import { Message } from "./message";
import { cn } from "@/lib/utils";
import { Chatbot } from "@/lib/definitions";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function MessageList({
  messages,
  containerClassName,
  isLoading,
  chatbot,
}: {
  messages: Message[];
  containerClassName?: string;
  isLoading?: boolean;
  chatbot: Chatbot;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  return (
    <div
      className={cn(
        "h-[358px] w-full mt-5  p-2  overflow-y-auto space-y-2.5",
        containerClassName
      )}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex items-start gap-4 text-sm", {
            "flex-row-reverse justify-start": message.role === "user",
          })}
        >
          {message.role === "assistant" && (
            <Avatar >
              {chatbot?.chatIcon ? (
                <AvatarImage
                  src={chatbot?.chatIcon}
                  alt="chatbot"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <AvatarImage
                  src="/images/dc.png"
                  alt="chatbot"
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8 object-cover"
                />
              )}
            </Avatar>
          )}
          <div
            className={cn(
              "grid max-w-[450px] bg-[#f1f1f1] px-4 py-2 items-center rounded-xl",
              {
                "text-white": message.role === "user",
              }
            )}
            style={{
              backgroundColor:
                (message.role === "user" &&
                  (chatbot.messageColor || "#4f36e5")) ||
                "#f1f1f1",
            }}
          >
            <div className="font-normal text-sm">
              <p className="break-words max-w-[180px] md:max-w-[450px] pr-6">
                {message.body}
              </p>
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <Avatar className={cn("flex items-start gap-4 text-sm", {})}>
          {chatbot.chatIcon ? (
            <AvatarImage
              src={chatbot?.chatIcon}
              alt="chatbot"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <AvatarImage
              src="/images/dc.png"
              alt="chatbot"
              width={32}
              height={32}
              className="rounded-full w-8 h-8 object-cover"
            />
          )}
          <div
            className={cn(
              "grid bg-[#f1f1f1] px-4 py-2 items-center rounded-xl"
            )}
          >
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce1"></div>
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce2"></div>
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce3"></div>
            </div>
          </div>
        </Avatar>
      )}
      <div ref={ref} />
    </div>
  );
}
