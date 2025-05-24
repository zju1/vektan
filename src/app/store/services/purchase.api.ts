import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import type { PurchaseOrderDTO } from "@/features/purchases/purchase-orders/purchase-order.dto";
import type { PurchaseConfirmationDTO } from "@/features/purchases/purchase-orders/PurchaseConfirmForm";

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
  tagTypes: ["PURCHASES", "PURCHASE_REQUESTS"],
  endpoints: (builder) => ({
    /* =============================================== */
    /* =============================================== */
    /* =============================================== */
    /* =============================================== */
    /* =============================================== */
    getPurchaseRequest: builder.query<
      PurchaseOrderDTO[],
      { confirmed?: boolean }
    >({
      query: ({ confirmed }) => ({
        url: confirmed ? "purchase/confirmed" : "purchase",
      }),
      providesTags: ["PURCHASES"],
    }),
    getPurchaseRequestById: builder.query<PurchaseOrderDTO, string | null>({
      query: (id) => ({
        url: `purchase/${id}`,
      }),
    }),
    createPurchaseRequest: builder.mutation<unknown, PurchaseOrderDTO>({
      query: (body) => ({
        url: "purchase",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PURCHASES"],
    }),
    updatePurchaseRequest: builder.mutation<
      unknown,
      { purchase: PurchaseOrderDTO; _id: string }
    >({
      query: ({ purchase: body, _id }) => ({
        url: `purchase/${_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PURCHASES"],
    }),
    confirmPurchaseRequest: builder.mutation<
      unknown,
      { purchase: PurchaseConfirmationDTO; _id: string }
    >({
      query: ({ purchase: body, _id }) => ({
        url: `purchase/${_id}/confirm`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PURCHASES"],
    }),
    deletePurchaseRequest: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `purchase/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PURCHASES"],
    }),
  }),
});

export const {
  useGetPurchaseRequestByIdQuery,
  useGetPurchaseRequestQuery,
  useCreatePurchaseRequestMutation,
  useUpdatePurchaseRequestMutation,
  useDeletePurchaseRequestMutation,
  useConfirmPurchaseRequestMutation,
} = purchasesApi;
