import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import type { UnitTypeDTO } from "@/features/settings/unit-types/unit-types.dto";
import type { LogisticsDTO } from "@/features/logistics/logistics.dto";
import type { CurrencyDTO } from "@/features/settings/currencies/currency.dto";
import type { FileResponse } from "@/@types";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
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
  tagTypes: ["UNIT_TYPES", "LOGISTICS", "CURRENCIES"],
  endpoints: (builder) => ({
    uploadMultipleFile: builder.mutation<
      { message: string; files: FileResponse[] },
      FormData
    >({
      query: (body) => ({
        url: "files/upload/multiple",
        method: "POST",
        body,
      }),
    }),
    getUnitTypes: builder.query<UnitTypeDTO[], void>({
      query: () => ({
        url: "settings/unitTypes",
      }),
      providesTags: ["UNIT_TYPES"],
    }),
    getUnitTypeById: builder.query<UnitTypeDTO, string | null>({
      query: (id) => ({
        url: `settings/unitTypes/${id}`,
      }),
    }),
    createUnitType: builder.mutation<unknown, UnitTypeDTO>({
      query: (body) => ({
        url: "settings/unitTypes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UNIT_TYPES"],
    }),
    updateUnitType: builder.mutation<
      unknown,
      { unitType: UnitTypeDTO; id: string }
    >({
      query: ({ unitType: body, id }) => ({
        url: `settings/unitTypes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["UNIT_TYPES"],
    }),
    deleteUnitType: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `settings/unitTypes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UNIT_TYPES"],
    }),
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    getLogisticsCompanies: builder.query<LogisticsDTO[], void>({
      query: () => ({
        url: "logistics",
      }),
      providesTags: ["LOGISTICS"],
    }),
    getLogisticsCompanyById: builder.query<LogisticsDTO, string | null>({
      query: (id) => ({
        url: `logistics/${id}`,
      }),
    }),
    createLogisticsCompany: builder.mutation<unknown, LogisticsDTO>({
      query: (body) => ({
        url: "logistics",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LOGISTICS"],
    }),
    updateLogisticsCompany: builder.mutation<
      unknown,
      { company: LogisticsDTO; id: string }
    >({
      query: ({ company: body, id }) => ({
        url: `logistics/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["LOGISTICS"],
    }),
    deleteLogisticsCompany: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `logistics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LOGISTICS"],
    }),
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    getCurrencies: builder.query<CurrencyDTO[], void>({
      query: () => ({
        url: "settings/currencies",
      }),
      providesTags: ["CURRENCIES"],
    }),
    getCurrencyByCode: builder.query<CurrencyDTO, string | null>({
      query: (code) => ({
        url: `settings/currencies/${code}`,
      }),
    }),
    createCurrency: builder.mutation<unknown, CurrencyDTO>({
      query: (body) => ({
        url: "settings/currencies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CURRENCIES"],
    }),
    updateCurrency: builder.mutation<
      unknown,
      { currency: CurrencyDTO; code: string }
    >({
      query: ({ currency: body, code }) => ({
        url: `settings/currencies/${code}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CURRENCIES"],
    }),
    deleteCurrency: builder.mutation<unknown, string>({
      query: (code) => ({
        url: `settings/currencies/${code}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CURRENCIES"],
    }),
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
  }),
});

export const {
  useUploadMultipleFileMutation,
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  useGetUnitTypesQuery,
  useGetUnitTypeByIdQuery,
  useCreateUnitTypeMutation,
  useUpdateUnitTypeMutation,
  useDeleteUnitTypeMutation,
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  useGetLogisticsCompaniesQuery,
  useGetLogisticsCompanyByIdQuery,
  useCreateLogisticsCompanyMutation,
  useUpdateLogisticsCompanyMutation,
  useDeleteLogisticsCompanyMutation,
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  useGetCurrenciesQuery,
  useGetCurrencyByCodeQuery,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
} = settingsApi;
