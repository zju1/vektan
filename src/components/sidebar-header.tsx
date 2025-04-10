import { setApp, setLanguage } from "@/app/store/slices/ui.slice";
import { useAppDispatch, useAppSelector } from "@/app/store/store.config";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button, Dropdown, Segmented } from "antd";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function SiteHeader() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const dispatch = useAppDispatch();
  const { app } = useAppSelector((store) => store.ui);
  const handleLanguageChange = (lang: string) => {
    dispatch(setLanguage(lang));
  };
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between px-2 md:px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Segmented
            value={app}
            onChange={(value) => {
              dispatch(setApp(value));
              navigate(value === "erp" ? "/" : "/statistics");
            }}
            options={[
              {
                label: t("erp"),
                value: "erp",
              },
              {
                label: t("aiAgents"),
                value: "aiAgents",
              },
            ]}
          />
        </div>
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: "uz",
                label: "O'zbekcha",
                onClick: () => handleLanguageChange("uz"),
              },
              {
                key: "ru",
                label: "Русский",
                onClick: () => handleLanguageChange("ru"),
              },
              {
                key: "en",
                label: "English",
                onClick: () => handleLanguageChange("en"),
              },
              {
                key: "kaa",
                label: "Qaraqalpaqsha",
                onClick: () => handleLanguageChange("kaa"),
              },
            ],
          }}
        >
          <Button
            icon={<Globe className="size-4 mt-1.5" />}
            variant="text"
            className="border-none items-center flex"
          >
            {t(language)}
          </Button>
        </Dropdown>
      </div>
    </header>
  );
}
