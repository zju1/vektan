import { useEffect, type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useGetMeQuery } from "../store/services/auth.service";
import { useAppDispatch } from "../store/store.config";
import { setUser } from "../store/slices/auth.slice";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard(props: PropsWithChildren) {
  const dispatch = useAppDispatch();

  const { access_token } = useAuth();

  const { data } = useGetMeQuery(
    { access_token },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  return access_token ? props.children : <Navigate to="/auth" />;
}
