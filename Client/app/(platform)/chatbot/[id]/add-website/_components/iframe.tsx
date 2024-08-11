"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";

export default function Iframe() {
  const { id } = useParams();
  const iframeRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyIframe = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(iframeRef.current?.innerText!);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <Card className="w-full lg:w-[961px] mx-auto rounded-b-none">
      <CardHeader className="text-center">
        <CardTitle className="text-base font-medium">app.chatfabrica.com</CardTitle>
        <CardDescription className="text-sm text-slate-400">
          To add the chatbot any where on your website, add this iframe to your
          html code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-[#F8F8FF] p-2.5 text-xs leading-5" ref={iframeRef}>
          &lt;iframe <br />
          src="https://app.chatfabrica.com/chatbot-iframe/{id}" <br />
          width="100%" <br /> style="height: 100%; <br /> min-height: 700px"{" "}
          <br />
          frameborder="0"
          <br />
          &gt;&lt;/iframe&gt;
        </div>
      </CardContent>
      <CardFooter className="items-center justify-center">
        <Button variant="secondary" onClick={copyIframe}>
          {isCopied ? "Copied" : "Copy Iframe"}
        </Button>
      </CardFooter>
    </Card>
  );
}
