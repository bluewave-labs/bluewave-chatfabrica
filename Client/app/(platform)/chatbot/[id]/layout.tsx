import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import SidebarMobile from "@/components/ui/sidebar-mobile";
import React from "react";

export default function ChatBotIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div
      style={{
        height: "calc(100vh - 70px)",
      }}
    >
      <Header />
      <div className="flex h-full flex-col md:flex-row md:overflow-hidden pt-[30px]">
        <div className="hidden md:flex md:flex-none md:sticky top-0 md:w-[254px]">
          <Sidebar id={params.id} />
        </div>
        <SidebarMobile>
          <Sidebar id={params.id} className="h-full" />
        </SidebarMobile>
        <div className="flex-grow md:overflow-y-auto p-6 lg:p-0 ">
          {children}
        </div>
      </div>
    </div>
  );
}
