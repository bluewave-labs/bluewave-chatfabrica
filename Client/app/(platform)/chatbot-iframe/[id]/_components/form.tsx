"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Chatbot } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export type Message = {
  id: string;
  body: string;
  date: Date;
  role: "assistant" | "user";
  from?: string;
};

export default function IframeMessageForm({ chatbot }: { chatbot: Chatbot }) {
  const formRef = useRef<HTMLFormElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Math.random().toString(36),
      body: chatbot.initialMessage,
      date: new Date(),
      role: "assistant",
      from: "CF",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();
    setIsLoading(true);

    // const threadId = sessionStorage.getItem("iframeThreadId");

    if (!event.currentTarget.message.value) {
      toast.error("Please enter a message");
      setIsLoading(false);
      return;
    }

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      body: event.currentTarget.message.value || message,
      date: new Date(),
      role: "user",
      from: "G",
    };
    // set the new messages
    setMessages((prev) => [...prev, newMessage]);

    let result: any;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/iframe/chatbots/${chatbot.id}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assistantId: chatbot.assistantId,
            message: event.currentTarget.message.value || message,
            ...(threadId && { threadId }),
            chatbotId: chatbot.id,
          }),
        }
      );

      result = await response.json();

      if (result?.status !== "success") {
        if (result?.message === "User has no credits") {
          setMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              body: "I cannot currently serve you as a chatbot, please contact the administrator.",
              date: new Date(),
              role: "assistant",
              from: "CF",
            },
          ]);

          return;
        }
        return toast.error(result?.message);
      }

      setThreadId(result.response[0].thread_id);
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
      setMessage("");
    }
  };

  const onSubmitExist = async (
    event: React.FormEvent<HTMLDivElement>,
    mess: string
  ) => {
    setIsLoading(true);
    event.preventDefault();
    setIsLoading(true);

    if (!mess) {
      toast.error("Please enter a message");
      setIsLoading(false);
      return;
    }

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      body: mess,
      date: new Date(),
      role: "user",
      from: "G",
    };
    // set the new messages
    setMessages((prev) => [...prev, newMessage]);

    let result: any;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/iframe/chatbots/${chatbot.id}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assistantId: chatbot.assistantId,
            message: mess,
            ...(threadId && { threadId }),
            chatbotId: chatbot.id,
          }),
        }
      );

      result = await response.json();

      if (result?.status !== "success") {
        return toast.error(result?.message);
      }

      setThreadId(result.response[0].thread_id);
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
      setMessage("");
    }
  };

  useEffect(() => {
    if (messages.length) {
      const scrollEl = contentRef.current;
      if (scrollEl) {
        scrollEl.scrollIntoView({ behavior: "smooth" });
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-auto shrink-0 flex-col overflow-hidden group cb-light bg-white px-8 py-6 absolute w-full z-50">
      <div className="z-10 flex justify-between items-center w-full">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-slate-700">
            {chatbot.displayName || "Customer Support"}
          </h3>
        </div>
      </div>

      <div className="h-full overflow-auto" ref={contentRef}>
        <div className="relative h-full">
          <div className="pt-[30px]">
            <div className="space-y-5">
              {messages?.length
                ? messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex items-end gap-4 text-sm", {
                        "flex-row-reverse justify-start":
                          message.role === "user",
                      })}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="w-[32px] h-[32px]">
                          {chatbot?.chatIcon ? (
                              <AvatarImage
                                src={chatbot?.chatIcon}
                                alt="chatbot"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                              />
                          ) : (
                            <AvatarImage
                            src="/images/dc.png"
                            alt="chatbot"
                            width={32}
                            height={32}
                            className="rounded-full w-8 h-8"
                          />
                          )}
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "grid  px-4 py-2 items-center rounded-t-[25px] rounded-br-[25px]",
                          {
                            "text-white rounded-bl-[25px] rounded-tr-none":
                              message.role === "user",
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
                          <Markdown>{message.body}</Markdown>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
              {isLoading && (
                <div className={cn("flex items-end gap-4 text-sm w-8 h-8", {})}>
                  {chatbot.chatIcon ? (
                      <Image
                        src={chatbot?.chatIcon}
                        alt="chatbot"
                        width={32}
                        height={32}
                        className="rounded-full w-8 h-8"
                      />
                  ) : (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g filter="url(#filter0_d_614_4094)">
                        <rect
                          x="2"
                          width="24"
                          height="24"
                          rx="12"
                          fill="url(#pattern0)"
                          shapeRendering="crispEdges"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_614_4094"
                          x="0"
                          y="0"
                          width="28"
                          height="28"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="2" />
                          <feGaussianBlur stdDeviation="1" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_614_4094"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_614_4094"
                            result="shape"
                          />
                        </filter>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_614_4094"
                            transform="scale(0.00059988)"
                          />
                        </pattern>
                        <image
                          id="image0_614_4094"
                          width="1667"
                          height="1667"
                          xlinkHref="data:image/png;base64,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AAAA8q7HDgEAAAAAAKRLDAIAAAAAAEiYGAQAAAAAAJAwMQgAAAAAACBhYhAAAAAAAEDCxCAAAAAAAICEiUEAAAAAAAAJE4MAAAAAAAASJgYBAAAAAAAkTAwCAAAAAABImBgEAAAAAACQMDEIAAAAAAAgYWIQAAAAAABAwsQgAAAAAACAhIlBAAAAAAAACRODAAAAAAAAEiYGAQAAAAAAJEwMAgAAAAAASJgYBAAAAAAAkDAxCAAAAAAAIGFiEAAAAAAAQMLEIAAAAAAAgISJQQAAAAAAAAkTgwAAAAAAABImBgEAAAAAACRMDAIAAAAAAEiYGAQAAAAAAJAwMQgAAAAAACBhYhAAAAAAAEDCxCAAAAAAAICEiUEAAAAAAAAJE4MAAAAAAAASJgYBAAAAAAAkTAwCAAAAAABImBgEAAAAAACQMDEIAAAAAAAgYWIQAAAAAABAwsQgAAAAAACAhIlBAAAAAAAACRODAAAAAAAAEiYGAQAAAAAAJEwMAgAAAAAASJgYBAAAAAAAkDAxCAAAAAAAIGFiEAAAAAAAQMLEIAAAAAAAgISJQQAAAAAAAAkTgwAAAAAAABImBgEAAAAAACRMDAIAAAAAAEiYGAQAAAAAAJAwMQgAAAAAACBhYhAAAAAAAEDCxCAAAAAAAICEiUEAAAAAAAAJE4MAAAAAAAASJgYBAAAAAAAkTAwCAAAAAABImBgEAAAAAACQMDEIAAAAAAAgYWIQAAAAAABAwsQgAAAAAACAhIlBAAAAAAAACRODAAAAAAAAEiYGAQAAAAAAJEwMAgAAAAAASJgYBAAAAAAAkDAxCAAAAAAAIGFiEAAAAAAAQMLEIAAAAAAAgISJQQAAAAAAAAkTgwAAAAAAABImBgEAAAAAACRMDAIAAAAAAEiYGAQAAAAAAJAwMQgAAAAAACBhYhAAAAAAAEDCxCAAAAAAAICEiUEAAAAAAAAJE4MAAAAAAAASJgYBAAAAAAAkTAwCAAAAAABImBgEAAAAAACQMDEIAAAAAAAgYWIQAAAAAABAwsQgAAAAAACAhIlBAAAAAAAACRODAAAAAAAAEiYGAQAAAAAAJEwMAgAAAAAASJgYBAAAAAAAkDAxCAAAAAAAIGFiEAAAAAAAQMLEIAAAAAAAgISJQQAAAAAAAAkTgwAAAAAAABImBgEAAAAAACRMDAIAAAAAAEiYGAQAAAAAAJAwMQgAAAAAACBhYhAAAAAAAEDCxCAAAAAAAICEiUEAAAAAAAAJE4MAAAAAAAASJgYBAAAAAAAkTAwCAAAAAABImBgEAAAAAACQMDEIAAAAAAAgYWIQAAAAAABAwsQgAAAAAACAhIlBAAAAAAAACRODAAAAAAAAEiYGAQAAAAAAJEwMAgAAAAAASJgYBAAAAAAAkDAxCAAAAAAAIGFiEAAAAAAAQMLEIAAAAAAAgISJQQAAAAAAAAkTgwAAAAAAABImBgEAAAAAACRMDAIAAAAAAEiYGAQAAAAAAJAwMQgAAAAAACBhYhAAAAAAAEDCxCAAAAAAAICEiUEAAAAAAAAJE4MAAAAAAAASJgYBAAAAAAAkTAwCAAAAAABImBgEAAAAAACQMDEIAAAAAAAgYWIQAAAAAABAwsQgAAAAAACAhIlBAAAAAAAACRODAAAAAAAAEiYGAQAAAAAAJEwMAgAAAAAASJgYBAAAAAAAkDAxCAAAAAAAIGFiEAAAAAAAQMLEIAAAAAAAgISJQQAAAAAAAAkTgwAAAAAAABImBgEAAAAAACRMDAIAAAAAAEiYGAQAAAAAAJAwMQgAAAAAACBhYhAAAAAAAEDCxCAAAAAAAICEiUEAAAAAAAAJE4MAAAAAAAASJgYBAAAAAAAkTAwCAAAAAABImBgEAAAAAACQMDEIAAAAAAAgYetCCJdsMAAAAAAAQIJC+Of/Dy8uqoTw77w+AAAAAElFTkSuQmCC"
                        />
                      </defs>
                    </svg>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {chatbot?.chatSuggestions?.length ? (
        <div className="flex items-center gap-x-1 overflow-x-auto h-20">
          {chatbot?.chatSuggestions?.map((suggestion, index) => (
            <div
              key={index}
              className="border border-slate-200 shrink-0 text-xs py-2 px-4 rounded-[6px] cursor-pointer text-[#0F172A] font-medium"
              onClick={(e) => onSubmitExist(e, suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      ) : null}
      <div className="bg-inherit mt-1">
        <form ref={formRef} onSubmit={onSubmit}>
          {/* <div className="flex gap-2 overflow-x-auto p-3"></div> */}
          <div className="flex-col ">
            <div className="flex flex-col w-full items-center leading-none gap-y-2">
              <Textarea
                id="message"
                name="message"
                className="max-h-36 h-[86px] resize-none outline-none ring-0 ring-offset-0 bg-white border"
                value={message}
                placeholder={chatbot.messagePlaceholder || ""}
                disabled={isLoading}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
              />
              {chatbot.includeChatFabricaAttribution && (
                <div className="flex items-center justify-center gap-x-1">
                  <span className="text-center w-full text-[10px] font-medium">
                    Powered By
                  </span>
                  <Link
                    href="https://chatfabrica.com"
                    target="_blank"
                    className="font-bold text-[10px]"
                  >
                    ChatFabrica
                  </Link>
                </div>
              )}
            </div>
            <Button
              disabled={isLoading}
              variant="ghost"
              className="w-full text-white mt-2 h-11"
              style={{
                backgroundColor: chatbot.chatBubbleButtonColor || "#4f46e5",
              }}
            >
              {chatbot.iconMessage || "Send Message"}
            </Button>
          </div>
        </form>
        {/* <div ref={contentRef} /> */}
      </div>
    </div>
  );
}
