import { useTranslation } from "react-i18next";
import { FileSearch } from "lucide-react";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-3xl w-full">
        <div className="p-8 flex flex-col items-center justify-center">
          <FileSearch className="h-24 w-24 text-blue-500 relative z-10" />
          <h1 className="mt-6 text-4xl font-bold text-gray-800">404</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700">
            {t("pageNotFound")}
          </h2>
          <p className="mt-2 text-gray-500 text-center max-w-md">
            {t("pageNotFoundDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
