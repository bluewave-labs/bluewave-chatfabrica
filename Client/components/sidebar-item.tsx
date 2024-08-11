"use client";

import React, { cloneElement } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next13-progressbar";

interface SidebarItemProps {
  id: string;
  icon: React.ReactElement;
  title: string;
  href: string;
}

export default function SidebarItem({
  id,
  icon,
  title,
  href,
}: SidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      className={cn(
        "w-56 h-11 rounded-lg flex items-center justify-start hover:text-indigo-600",
        {
          "bg-slate-100 text-indigo-600":
            pathname === href.replace("{{id}}", id),
        }
      )}
      variant="ghost"
      onClick={() => router.push(href.replace("{{id}}", id))}
    >
      {cloneElement(icon, {
        className: "mr-2.5",
        size: 24,
      })}
      {title}
    </Button>
  );
}
