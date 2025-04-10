import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { navigationData } from "@/config/navigation-links";
import { useAppSelector } from "@/app/store/store.config";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { app } = useAppSelector((store) => store.ui);
  return (
    <Sidebar collapsible="icon" {...props} className="overflow-hidden">
      <SidebarHeader className="p-4 pb-2">
        <img
          src="/vektan.png"
          className="h-[30px] w-auto object-contain flex self-start brightness-0 invert"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            app === "erp" ? navigationData.navMain : navigationData.navAgents
          }
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
