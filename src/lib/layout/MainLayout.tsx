import { AuthGuard } from "@/app/guard/AuthGuard";
import { useAppSelector } from "@/app/store/store.config";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  const {
    i18n: { changeLanguage },
  } = useTranslation();
  const language = useAppSelector((store) => store.ui.language);

  useEffect(() => {
    changeLanguage(language);
  }, [changeLanguage, language]);

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-sidebar p-0 md:pt-4 md:pr-4 grid">
          <div className="bg-white h-dvh md:h-[calc(100dvh-24px)] md:rounded-xl grid items-start grid-rows-[auto_1fr] content-start border overflow-hidden">
            <SiteHeader />
            <div className="grid overflow-y-auto h-full items-start content-start p-2 md:p-4 bg-gray-100 min-h-full">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
