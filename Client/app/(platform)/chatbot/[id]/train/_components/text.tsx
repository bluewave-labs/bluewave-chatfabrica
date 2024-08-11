"use client";

import { Textarea } from "@/components/ui/textarea";
import { useTextArea } from "@/hooks/use-textarea";
import React from "react";

export default function TextForm() {
  const { text, setText } = useTextArea();

  return (
    <div className="w-full mt-4">
      <Textarea
        className="h-[380px] resize-none"
        placeholder="Data"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </div>
  );
}
