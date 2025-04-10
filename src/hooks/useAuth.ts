import { resetAuth } from "@/app/store/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "@/app/store/store.config";
import { Modal } from "antd";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useAuth() {
  const auth = useAppSelector((store) => store.auth);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const logout = useCallback(() => {
    Modal.confirm({
      title: t("warning"),
      content: t("logoutWarning"),
      onOk: () => {
        dispatch(resetAuth());
      },
    });
  }, [dispatch, t]);

  return { ...auth, logout };
}
