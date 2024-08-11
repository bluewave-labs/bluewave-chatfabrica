import React from "react";

import navMenus from "@/config/nav-menu";
import SidebarItem from "./sidebar-item";
import SidebarCollapsible from "./sidebar-collapsible";
import Logout from "./logout";
import { cn } from "@/lib/utils";

export default function Sidebar({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "min-h-[calc(100vh-110px)]  h-[500px] bg-transparent md:bg-white rounded-tr-[16px] rounded-br-[16px] py-2 px-[15px] md:shadow-md flex flex-col pb-5",
        className
      )}
    >
      <div className="flex flex-col gap-y-2">
        {navMenus.map((menu, index) =>
          menu.children?.length ? (
            <SidebarCollapsible
              key={index}
              id={id}
              title={menu.title}
              icon={menu.icon}
              childrens={menu.children}
            />
          ) : (
            <SidebarItem
              key={index}
              id={id}
              title={menu.title}
              icon={menu.icon}
              href={menu.href}
            />
          )
        )}
      </div>
      <Logout />
    </aside>
  );
}
