import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import type { RequestParamsType } from "@/@types";
import { envVariables } from "@/config/env";
import type { AuthResponse, AuthUser, LoginDTO } from "@/features/LoginPage";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: envVariables.BASE_URL,
    prepareHeaders: (headers, api) => {
      const { auth } = api.getState() as RootState;

      if (auth.access_token) {
        headers.set("Authorization", `Bearer ${auth.access_token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    signin: builder.mutation<AuthResponse, LoginDTO>({
      query: (body) => ({
        url: "auth/login",
        body,
        method: "POST",
      }),
    }),
    getMe: builder.query<AuthUser, RequestParamsType>({
      query: () => ({
        url: "auth/me",
      }),
    }),
  }),
});

export const { useSigninMutation, useGetMeQuery } = authApi;
