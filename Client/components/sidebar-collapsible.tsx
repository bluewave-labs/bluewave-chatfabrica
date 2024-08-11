"use client";

import React, { cloneElement, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useRouter } from "next13-progressbar";

export default function SidebarCollapsible({
  id,
  title,
  icon,
  childrens,
}: {
  id: string;
  title: string;
  icon: React.ReactElement;
  childrens: {
    title: string;
    href: string;
    icon: React.ReactElement;
  }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild className="relative">
        <Button
          className={cn(
            "w-56 h-11 rounded-lg flex items-center justify-start hover:text-indigo-600 gap-x-2.5"
          )}
          variant="ghost"
        >
          {cloneElement(icon, {
            size: 24,
          })}
          {title}
          <ChevronDown
            className={cn("h-4 w-4 absolute right-4", {
              "transform rotate-180": isOpen,
            })}
          />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {childrens?.map((child, index) => (
          <div
            key={index}
            className="rounded-md pr-4 text-sm w-[184px] ml-auto"
            onClick={() => router.push(child.href.replace("{{id}}", id))}
          >
            <Button
              className={cn(
                "w-[184px] h-10 rounded-lg flex items-center justify-start hover:text-indigo-600 gap-x-2.5",
                {
                  "bg-slate-100 text-indigo-600":
                    `${pathname}?data-source=${searchParams.get(
                      "data-source"
                    )}` === child.href.replace("{{id}}", id),
                }
              )}
              variant="ghost"
            >
              {cloneElement(child.icon, {
                className: "mr-2.5",
                size: 24,
              })}
              {child.title}
            </Button>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
