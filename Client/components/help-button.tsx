"use client";
import React from "react";
import { Info } from "lucide-react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function HelpButton() {
  const { id } = useParams();
  
  return (
    <Link href={`/chatbot/${id}/help`} className="flex items-center gap-y-6">
      <Button
        type="button"
        variant="ghost"
        className="flex items-center w-56 h-11 gap-x-2.5 px-3 hover:bg-slate-100 rounded-lg justify-start"
      >
        <Info />
        Help
      </Button>
    </Link>
  );
}
