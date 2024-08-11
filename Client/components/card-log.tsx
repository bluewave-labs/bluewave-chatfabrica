import React from "react";
import moment from "moment";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { ChatLog } from "@/lib/definitions";

export default function CardLog({
  onClick,
  chatLog,
  isActive,
}: {
  onClick: () => void;
  chatLog: ChatLog;
  isActive: boolean;
}) {
  return (
    <Card
      className={cn(
        "bg-white  w-full lg:w-[251px] rounded-[8px] p-3 shadow-sm lg:shadow-md cursor-pointer",
        {
          "bg-slate-100": isActive,
        }
      )}
      onClick={onClick}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-slate-500 text-sm">User:</span>
        <span className="text-slate-500 text-sm">
          {moment.utc(chatLog.createdAt).local().startOf("seconds").fromNow()}
        </span>
      </div>
      <span className="text-sm leading-3 break-words">{chatLog.messages[0].content}</span>
    </Card>
  );
}
