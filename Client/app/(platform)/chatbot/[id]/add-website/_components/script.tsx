"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";

export default function Script() {
  const { id } = useParams();
  const scriptRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyScript = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(scriptRef.current?.innerText!);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <Card className="w-full lg:w-[961px] mx-auto rounded-t-none">
      <CardHeader className="text-center">
        <CardDescription className="text-sm text-slate-400">
          To add a chat bubble to the bottom right of your website add this
          script tag to your html
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-[#F8F8FF] p-2.5 text-xs leading-5" ref={scriptRef}>
          &lt;script&gt; <br /> window.embeddedChatbotConfig = &#x7B;
          <br />
          &nbsp;&nbsp;chatbotId: "{id}",
          <br />
          &nbsp;&nbsp;domain: "app.chatfabrica.com",
          <br />
          &#x7D;; <br />
          &lt;/script&gt;
          <br />
          &lt;script <br />
          src="https://app.chatfabrica.com/chatbot.min.js" <br />
          defer&gt; <br />
          &lt;/script&gt;
        </div>
      </CardContent>
      <CardFooter className="items-center justify-center">
        <Button variant="secondary" onClick={copyScript}>
          {isCopied ? "Copied" : "Copy Script"}
        </Button>
      </CardFooter>
    </Card>
  );
}
