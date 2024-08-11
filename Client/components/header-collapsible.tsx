"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { CheckIcon, ChevronDown } from "lucide-react";
import { Chatbot } from "@/lib/definitions";
import { useParams } from "next/navigation";
import { useRouter } from "next13-progressbar";

export default function HeaderCollapsible({
  chatBots,
}: {
  chatBots: Chatbot[];
}) {
  const router = useRouter();
  const params = useParams();
  const chatbotId = params.id;

  const [open, setOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<any>(
    chatBots.find((ch) => ch.id === chatbotId) || chatBots[0]
  );

  useEffect(() => {
    if (typeof selectedChatbot === "object") {
      window.localStorage.setItem("selectedChatbot", selectedChatbot.id);
    }
  }, [selectedChatbot]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("w-[200px] justify-between ")}
        >
         <span className="w-[190px] overflow-hidden text-ellipsis whitespace-nowrap">{selectedChatbot?.name}</span> 
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No chatbot found.</CommandEmpty>
            {chatBots?.map((chatbot) => (
              <CommandItem
                key={chatbot.id}
                onSelect={() => {
                  setSelectedChatbot(chatbot);
                  setOpen(false);
                  router.push(`/chatbot/${chatbot.id}`);
                }}
                className="text-sm"
              >
                {chatbot.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedChatbot?.id === chatbot.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
