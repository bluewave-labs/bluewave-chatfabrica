"use client";

import React, { useEffect } from "react";
import { Sheet, SheetContent } from "./sheet";
import { useMobileSidebar } from "@/hooks/use-sidebar";
import { usePathname } from "next/navigation";

export default function SidebarMobile({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, onClose } = useMobileSidebar();
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left">{children}</SheetContent>
    </Sheet>
  );
}
