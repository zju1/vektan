import { useTranslation } from "react-i18next";

export function useRules() {
  const { t } = useTranslation();
  return {
    required: {
      required: true,
      message: t("required"),
    },
  };
}
