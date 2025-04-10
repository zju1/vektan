import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import type { PurchaseDTO } from "@/features/purchases/purchase.dto";

export const purchasesApi = createApi({
  reducerPath: "purchasesApi",
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
  tagTypes: ["PURCHASES"],
  endpoints: (builder) => ({
    getPurchases: builder.query<PurchaseDTO[], void>({
      query: () => ({
        url: "purchase",
      }),
      providesTags: ["PURCHASES"],
    }),
    getPurchaseById: builder.query<PurchaseDTO, string | null>({
      query: (id) => ({
        url: `purchase/${id}`,
      }),
    }),
    createPurchase: builder.mutation<unknown, PurchaseDTO>({
      query: (body) => ({
        url: "purchase",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PURCHASES"],
    }),
    updatePurchase: builder.mutation<
      unknown,
      { purchase: PurchaseDTO; id: string }
    >({
      query: ({ purchase: body, id }) => ({
        url: `purchase/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PURCHASES"],
    }),
    deletePurchase: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `purchase/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PURCHASES"],
    }),
  }),
});

export const {
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchasesApi;
