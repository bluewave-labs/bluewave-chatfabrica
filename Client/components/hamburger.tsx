"use client";

import { useMobileSidebar } from "@/hooks/use-sidebar";
import { Menu, X } from "lucide-react";
import React from "react";

export default function Hamburger() {
  const { isOpen, toggle } = useMobileSidebar();

  return (
    <button
      onClick={toggle}
      className="md:hidden w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center"
    >
      {isOpen ? (
        <X className="text-indigo-600" strokeWidth={2} />
      ) : (
        <Menu className="text-indigo-600" strokeWidth={2} />
      )}
    </button>
  );
}
