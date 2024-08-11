"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import { Pencil } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { updateChatbot } from "@/actions/update-chatbot";
import { toast } from "sonner";
import { useRouter } from "next13-progressbar";

const ChatbotCard = ({
  id,
  title,
  assistantId,
  model,
}: {
  id: string;
  title: string;
  assistantId: string;
  model: string;
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(title);
  const router = useRouter();

  const { execute } = useAction(updateChatbot, {
    onSuccess: () => {
      toast.success("Chatbot name updated successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handlePencilClick = () => {
    setEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(e.target.value);
  };

  const handleInputBlur = () => {
    setEditing(false);
    execute({
      assistantId,
      model,
      name: text,
    });
  };

  const handleButtonClick = () => {
    if (!editing) {
      router.push(`/chatbot/${id}`);
    }
  };

  useEffect(() => {
    setText(title);
  }, [title]);


  return (
    <div className="flex items-center gap-x-[5px] group w-[230px] cursor-pointer">
      {editing ? (
        <input
          type="text"
          className="border border-gray-300 p-2 w-[200px]"
          value={text}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleInputBlur();
            }
          }}
        />
      ) : (
        <>
          <span
            className="w-[200px] px-4 py-2 rounded-[6px] overflow-hidden text-ellipsis whitespace-nowrap border"
            onClick={handleButtonClick}
          >
           {text}
          </span>
          <Pencil
            size={24}
            className="text-slate-700 cursor-pointer hidden group-hover:block"
            onClick={handlePencilClick}
          />
        </>
      )}
    </div>
  );
};

export default ChatbotCard;
