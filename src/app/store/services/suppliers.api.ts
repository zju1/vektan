import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import type { SupplierDTO } from "@/features/suppliers/supplier.dto";

export const suppliersApi = createApi({
  reducerPath: "suppliersApi",
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
  tagTypes: ["SUPPLIERS"],
  endpoints: (builder) => ({
    getSuppliers: builder.query<SupplierDTO[], void>({
      query: () => ({
        url: "supply/suppliers",
      }),
      providesTags: ["SUPPLIERS"],
    }),
    getSupplierById: builder.query<SupplierDTO, string | null>({
      query: (id) => ({
        url: `supply/suppliers/${id}`,
      }),
    }),
    createSupplier: builder.mutation<unknown, SupplierDTO>({
      query: (body) => ({
        url: "supply/suppliers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SUPPLIERS"],
    }),
    updateSupplier: builder.mutation<
      unknown,
      { supplier: SupplierDTO; id: string }
    >({
      query: ({ supplier: body, id }) => ({
        url: `supply/suppliers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SUPPLIERS"],
    }),
    deleteSupplier: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `supply/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUPPLIERS"],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
