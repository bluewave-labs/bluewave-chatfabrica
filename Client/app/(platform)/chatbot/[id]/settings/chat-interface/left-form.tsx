"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Session } from "next-auth";
import { Chatbot } from "@/lib/definitions";
import FormSubmit from "@/components/form/form-submit";
import Message from "./_components/message";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { customizeChatbot } from "@/actions/customize-chatbot";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LeftForm({
  session,
  chatbot,
}: {
  session: Session | null;
  chatbot: Chatbot;
}) {
  const { execute } = useAction(customizeChatbot, {
    onSuccess: () => {
      toast.success("Chatbot settings updated successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const [customize, setCustomize] = React.useState({
    initialMessage: chatbot.initialMessage,
    chatSuggestions: chatbot.chatSuggestions,
    displayName: chatbot.displayName || "AI Bot",
    placeholder: chatbot.messagePlaceholder,
    alignButton: chatbot.alignButton,
    initialMessageShowTime: chatbot.initialMessageShowTime || 1,
    color: chatbot.messageColor || "#3b81f6",
    profilePicture: chatbot.chatIcon || "",
    buttonColor: chatbot.chatBubbleButtonColor || "#4f36e5",
    iconMessage: chatbot.iconMessage || "Send Message",
  });

  const handleReset = () => {
    setCustomize({
      initialMessage: chatbot.initialMessage,
      chatSuggestions: chatbot.chatSuggestions,
      displayName: chatbot.displayName || "AI Bot",
      placeholder: chatbot.messagePlaceholder,
      alignButton: chatbot.alignButton,
      initialMessageShowTime: chatbot.initialMessageShowTime || 1,
      color: chatbot.messageColor || "#3b81f6",
      profilePicture: chatbot.chatIcon || "",
      buttonColor: chatbot.chatBubbleButtonColor || "#4f36e5",
      iconMessage: chatbot.iconMessage || "Send Message",
    });
  };

  const onSubmit = (formData: FormData) => {
    execute({
      id: chatbot.id,
      initialMessage: customize.initialMessage,
      chatSuggestions: customize.chatSuggestions,
      displayName: customize.displayName,
      placeholder: customize.placeholder || "",
      alignButton: customize.alignButton,
      initialMessageShowTime: customize.initialMessageShowTime,
      messageColor: customize.color,
      chatBubbleButtonColor: customize.buttonColor,
      iconMessage: customize.iconMessage,
      chatIcon: customize.profilePicture,
    });
  };

  const handleUpload = () => {
    const fileInput = document.getElementById(
      "bot_profile_picture"
    ) as HTMLInputElement;
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      const formData = new FormData();
      formData.append("file", file as File);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setCustomize({
        ...customize,
        profilePicture: data.publicUrl,
      });

      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.src = event?.target?.result as string;
          img.width = 56;
          img.height = 56;
          img.className = "rounded-full w-full h-full object-cover";
          const profilePictureContainer = document.querySelector(
            ".h-14.w-14.rounded-full.border.bg-zinc-200.flex.items-center.justify-center"
          );
          if (profilePictureContainer) {
            profilePictureContainer.innerHTML = "";
            profilePictureContainer.appendChild(img);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  return (
    <div className="flex gap-10 justify-between w-full">
      <form action={onSubmit} className="w-full lg:w-1/2 px-2">
        <span className="text-sm text-stone-400">
          Note: Applies when embedded on a website
        </span>
        <div className="flex flex-col gap-y-2 mt-4">
          <div className="flex justify-between mt-4">
            <span className="text-sm ">Initial Messages</span>
            <Button onClick={handleReset} type="button" variant="secondary">
              Reset
            </Button>
          </div>
          <Textarea
            id="initialMessage"
            name="initialMessage"
            className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
            value={customize.initialMessage}
            onChange={(e) =>
              setCustomize({
                ...customize,
                initialMessage: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col gap-y-2 mt-4">
  <div className="flex justify-between mt-4">
    <span className="text-sm ">Suggested Messages</span>
  </div>
  <Textarea
    id="initialMessage"
    name="initialMessage"
    className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
    value={customize?.chatSuggestions?.join("\n") || ""}
    onChange={(e) => {
      const newValue = e.target.value;
      setCustomize({
        ...customize,
        chatSuggestions: newValue.trim() === "" ? [] : newValue.split("\n"),
      });
    }}
  />
  <span className="text-sm text-stone-400">
    Enter each message in a new line.
  </span>
</div>
        <div className="mt-4">
          <label className="text-sm">Message Placeholder</label>
          <Input
            className="placeholder:text-zinc-400 text-sm"
            placeholder="Message..."
            value={customize.placeholder || ""}
            onChange={(e) =>
              setCustomize({
                ...customize,
                placeholder: e.target.value,
              })
            }
          />
        </div>
        <p className="mt-8 text-sm text-stone-400 mt-">
          You can use this to add a disclaimer or a link to your privacy policy.
        </p>

        <div className="space-y-2 mt-8">
          <Label>Align Chat Bubble Button</Label>
          <Select
            name="Align Chat Bubble Button"
            value={customize.alignButton}
            onValueChange={(value) => {
              setCustomize({
                ...customize,
                alignButton: value as "Right" | "Left",
              });
            }}
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Right">Right</SelectItem>
              <SelectItem value="Left">Left</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 text-sm text-zinc-700">
          Auto show initial messages pop-ups after
          <Input
            id="initialMessageShowTime"
            name="initialMessageShowTime"
            type="number"
            min={0}
            value={customize.initialMessageShowTime}
            onChange={(e) =>
              setCustomize({
                ...customize,
                initialMessageShowTime: parseInt(e.target.value),
              })
            }
          />
          seconds (negative to disable)
        </div>

        <div className="mt-8 text-sm text-zinc-700 flex flex-col">
          Display name
          <Input
            onChange={(e) =>
              setCustomize({
                ...customize,
                displayName: e.target.value,
              })
            }
            value={customize.displayName}
          />
        </div>

        <div className="mt-8 text-sm text-zinc-700 flex flex-col">
          Button Text
          <Input
            onChange={(e) =>
              setCustomize({
                ...customize,
                iconMessage: e.target.value,
              })
            }
            value={customize.iconMessage}
          />
        </div>
        <div className="mt-8 text-sm text-zinc-700 flex items-center gap-x-3">
          <div className="flex w-full flex-row items-center gap-4 py-3">
            <div className="h-14 w-14 rounded-full border border-zinc-300 bg-zinc-200 flex items-center justify-center">
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
                  <AvatarFallback className="bg-zinc-200 w-full h-full">
                    CF
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="flex flex-col gap-1">
              <span className="mb-1 block text-sm font-medium text-zinc-700">
                Profile Picture
              </span>
              <div className="flex flex-row items-center gap-2">
                <input
                  id="bot_profile_picture"
                  accept="image/*"
                  className="hidden"
                  type="file"
                  name="bot_profile_picture"
                />
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-7 rounded-md px-3 text-xs"
                  type="button"
                  id="bot_profile_picture_button"
                  name="bot_profile_picture_button"
                  onClick={handleUpload}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-upload mr-2 h-4 w-4"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" x2="12" y1="3" y2="15"></line>
                  </svg>
                  Upload image
                </button>
              </div>
              <span className="mt-1 text-xs text-zinc-500">
                Supports JPG, PNG, and SVG files up to 1MB
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-zinc-700 flex flex-col">
          User Message Color
          <input
            type="color"
            className="w-[35px] h-[35px] rounded-sm"
            value={customize.color}
            onChange={(e) =>
              setCustomize({
                ...customize,
                color: e.target.value,
              })
            }
          />
        </div>

        <div className="mt-8 text-sm text-zinc-700 flex flex-col">
          Chat Bubble Button Color
          <input
            type="color"
            className="w-[35px] h-[35px] rounded-sm"
            value={customize.buttonColor}
            onChange={(e) =>
              setCustomize({
                ...customize,
                buttonColor: e.target.value,
              })
            }
          />
        </div>

        <FormSubmit className="mt-4 w-full">Save</FormSubmit>
      </form>
      <div className="w-full lg:w-1/2 rounded-lg relative">
        <div className="flex justify-between flex-col w-full mx-auto px-5 py-10 bg-white rounded-[16px] shadow-md">
          <div className="flex justify-between">
            <span className="text-slate-300 text-xl whitespace-nowrap">
              {customize.displayName}
            </span>
            <RefreshCcw className="cursor-pointer" />
          </div>
          <Message customize={customize} />
        </div>

        <div
          className={cn(
            "w-[50px] h-[50px] flex items-center justify-center text-white text-[30px] cursor-pointer z-[999] rounded-[25px] absolute -bottom-2",
            {
              "right-2": customize.alignButton === "Right",
              "left-2": customize.alignButton === "Left",
            }
          )}
          style={{
            backgroundColor: customize.buttonColor,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            width="24"
            height="24"
            id="message"
          >
            <path d="M5.2 22c-.4 0-.9-.1-1.3-.2s-.6-.3-.8-.5l-.1-.1c-.1-.1-.2-.3-.2-.4 0-.2.1-.3.3-.4.8-.4 1.5-1.1 1.9-1.9 0-.1 0-.2.1-.3C2.3 16.5.7 13.8.7 11 .6 6 5.7 2 12 2c6.3 0 11.4 4 11.4 9s-5.1 9.1-11.4 9.1c-.6 0-1.3 0-1.9-.1-1.5 1.3-3.2 2-4.9 2zm-1-1.1c1.7.4 3.7-.3 5.5-1.8 0-.1.2-.2.3-.1.6.1 1.3.1 2 .1 5.7 0 10.4-3.6 10.4-8.1S17.7 3 12 3 1.6 6.6 1.6 11c0 2.6 1.6 5 4.3 6.5.2.1.3.4.2.6 0 .3-.1.6-.3.9-.4.8-1 1.4-1.6 1.9z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
