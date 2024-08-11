"use client";
import React, { useEffect, useRef } from "react";
import { Message } from "./message";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export default function MessageList({
  messages,
  containerClassName,
  isLoading,
  customize,
}: {
  messages: Message[];
  containerClassName?: string;
  isLoading?: boolean;
  customize?: {
    initialMessage: string;
    chatSuggestions: string[] | null;
    placeholder: string | null;
    color: string;
    profilePicture: string;
  };
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
        "h-[358px] w-full mt-5 p-6 overflow-y-auto space-y-2.5",
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
            <Avatar className="bg-slate-200 items-center justify-center">
              {customize?.profilePicture ? (
                <AvatarImage
                  src={customize.profilePicture}
                  alt="Profile Picture"
                  width={56}
                  height={56}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback>CF</AvatarFallback>
              )}
            </Avatar>
          )}

          <div
            className={cn(
              "grid bg-[#f1f1f1] px-4 py-2 items-center rounded-xl",
              {
                "text-white": message.role === "user",
              }
            )}
            style={{
              backgroundColor:
                message.role === "user" ? customize?.color : "#f1f1f1",
            }}
          >
            <div className="font-normal text-sm">{message.body}</div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className={cn("flex items-start gap-4 text-sm", {})}>
          <Avatar className="bg-slate-200 items-center justify-center">
            <AvatarFallback>CF</AvatarFallback>
          </Avatar>
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
        </div>
      )}
      <div ref={ref} />
    </div>
  );
}
