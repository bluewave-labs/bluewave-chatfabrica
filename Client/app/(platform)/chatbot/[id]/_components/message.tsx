"use client";

import React, { useRef, useState } from "react";
import { Session, User } from "next-auth";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Chatbot } from "@/lib/definitions";
import MessageList from "./message-list";
import Image from "next/image";
import { RefreshCcw } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export type Message = {
  id: string;
  body: string;
  date: Date;
  role: "assistant" | "user";
  from: string;
};

export default function Message({
  user,
  chatbot,
  session,
}: {
  user: User;
  chatbot: Chatbot;
  session: Session | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Math.random().toString(36),
      body: chatbot.initialMessage || "Hi! What can I help you with?",
      date: new Date(),
      role: "assistant",
      from: "CF",
    },
  ]);
  const [threadId, setThreadId] = useState<string>("");

  const handleRefresh = () => {
    setThreadId("");
    setMessages([
      {
        id: Math.random().toString(36),
        body: chatbot.initialMessage,
        date: new Date(),
        role: "assistant",
        from: "CF",
      },
    ]);
    sessionStorage.removeItem("iframeThreadId");
  };

  async function addMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const message = event.currentTarget.message.value;

    if (!message) {
      toast.error("Please enter a message");
      setIsLoading(false);
      return;
    }

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      body: message,
      date: new Date(),
      role: "user",
      from: user.name?.split(" ")[0] + " " + user.name?.split(" ")[1][0],
    };
    formRef?.current?.reset();
    // set the new messages
    setMessages((prev) => [...prev, newMessage]);

    let result: any;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
          threadId ? "chatbot-message" : "chatbot-first-message"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify({
            assistantId: chatbot.assistantId,
            message: message,
            ...(threadId && { threadId }),
            chatbotId: chatbot.id,
          }),
        }
      );

      result = await response.json();

      if (result?.status !== "success") {
        return toast.error(result?.message);
      }

      setThreadId(result?.response[0]?.thread_id);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          body: result.response[0]?.content[0]?.text?.value,
          date: new Date(),
          role: "assistant",
          from: "CF",
        },
      ]);
    } catch (error) {
      toast.error("Something went wrong while creating the message.");
    } finally {
      formRef?.current?.reset();
      setIsLoading(false);
    }
  }

  async function completeMessage(message: string) {
    if (isLoading) return;
    setIsLoading(true);

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      body: message,
      date: new Date(),
      role: "user",
      from: user.name?.split(" ")[0] + " " + user.name?.split(" ")[1][0],
    };
    setMessages([...messages, newMessage]);

    let result: any;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${
          threadId ? "chatbot-message" : "chatbot-first-message"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify({
            assistantId: chatbot.assistantId,
            message,
            ...(threadId && { threadId }),
            chatbotId: chatbot.id,
          }),
        }
      );

      result = await response.json();

      if (result?.status !== "success") {
        return toast.error(result?.message);
      }

      setThreadId(result?.response[0]?.thread_id);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          body: result.response[0]?.content[0]?.text?.value,
          date: new Date(),
          role: "assistant",
          from: "CF",
        },
      ]);
    } catch (error) {
      toast.error("Something went wrong while creating the message.");
    } finally {
      formRef?.current?.reset();
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1.5">
          <Avatar className="flex items-center justify-center mt-4 w-[60px]  h-[60px] rounded-full shadow-lg">
          {chatbot?.chatIcon ? (
                <AvatarImage
                  src={chatbot?.chatIcon}
                  alt="Profile Picture"
                  width={60}
                  height={60}
                  className="rounded-full object-cover "
                />
           ) : (
            <AvatarImage
              src="/images/dc.png"
              alt="CF"
              width={60}
              height={60}
              className="w-[60px] h-[60px] rounded-full"
            />
          )}
          </Avatar>
          <div className="flex flex-col mt-[30px]">
            <h3 className="text-[24px] font-semibold text-[#4F46E5]">
              ChatFabrica
            </h3>
            <span className="text-slate-300 text-xl">
              {chatbot.displayName || "AI Bot"}
            </span>
          </div>
        </div>
        <RefreshCcw className="cursor-pointer" onClick={handleRefresh} />
      </div>
      <MessageList
        messages={messages}
        isLoading={isLoading}
        chatbot={chatbot}
      />
      <div className="flex items-center gap-x-1 mt-5 overflow-x-auto">
        {chatbot.chatSuggestions?.map((suggestion, index) => (
          <Button
            className="bg-slate-700"
            onClick={() => completeMessage(suggestion)}
            key={index}
          >
            {suggestion}
          </Button>
        ))}
      </div>
      <form ref={formRef} onSubmit={addMessage} className="mt-5 space-y-2">
        <div className="w-full h-[80px]">
          <Textarea
            id="message"
            name="message"
            placeholder={chatbot.messagePlaceholder || "Type your message here"}
            className="resize-none"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (isLoading) return;
                formRef.current?.requestSubmit();
              }
            }}
          />
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full"
          style={{
            backgroundColor: chatbot.chatBubbleButtonColor || "#4F46E5",
          }}
        >
          {isLoading && (
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          {chatbot.iconMessage || "Send message"}
        </Button>
        {/* <Button
          onClick={() => router.push(`/chatbot/${chatbot.id}/sources`)}
          type="button"
          variant="secondary"
          className="w-full bg-white text-indigo-600 shadow-md"
        >
          Show Sources
        </Button> */}
      </form>
    </>
  );
}
