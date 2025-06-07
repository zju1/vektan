import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import type { UnitTypeDTO } from "@/features/settings/unit-types/unit-types.dto";
import type { LogisticsDTO } from "@/features/logistics/logistics.dto";
import type { CurrencyDTO } from "@/features/settings/currencies/currency.dto";
import type { FileResponse, RequestParamsType } from "@/@types";
import type { ConsigneeDTO } from "@/features/settings/consignees/consignees.dto";
import type {
  CityDTO,
  CountryDTO,
} from "@/features/settings/countries/countries.dto";
import type { BagTypeDTO } from "@/features/settings/bagTypes/bagType.dto";
import type { MarkDTO } from "@/features/settings/marks/mark.dto";

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
  tagTypes: [
    "UNIT_TYPES",
    "LOGISTICS",
    "CURRENCIES",
    "CONSIGNEES",
    "COUNTRY",
    "CITY",
    "BagType",
    "Mark",
  ],
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
    getConsignees: builder.query<ConsigneeDTO[], void>({
      query: () => "/consignees",
      providesTags: ["CONSIGNEES"],
    }),
    getConsigneeById: builder.query<ConsigneeDTO, string>({
      query: (id) => `/consignees/${id}`,
      providesTags: (_a, _b, id) => [{ type: "CONSIGNEES", id }],
    }),

    createConsignee: builder.mutation<ConsigneeDTO, Partial<ConsigneeDTO>>({
      query: (consignee) => ({
        url: "/consignees",
        method: "POST",
        body: consignee,
      }),
      invalidatesTags: ["CONSIGNEES"],
    }),

    updateConsignee: builder.mutation<
      ConsigneeDTO,
      { id: string; consignee: Partial<ConsigneeDTO> }
    >({
      query: ({ id, consignee }) => ({
        url: `/consignees/${id}`,
        method: "PUT",
        body: consignee,
      }),
      invalidatesTags(_result, _error) {
        return [{ type: "CONSIGNEES" }];
      },
    }),

    deleteConsignee: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/consignees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags() {
        return [{ type: "CONSIGNEES" }];
      },
    }),
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    getCountries: builder.query<CountryDTO[], void>({
      query: () => "/settings/countries",
      providesTags: ["COUNTRY"],
    }),
    getCountryById: builder.query<CountryDTO, string>({
      query: (id) => `/settings/countries/${id}`,
      providesTags: ["COUNTRY"],
    }),
    createCountry: builder.mutation<CountryDTO, Partial<CountryDTO>>({
      query: (country) => ({
        url: "/settings/countries",
        method: "POST",
        body: country,
      }),
      invalidatesTags: ["COUNTRY"],
    }),
    updateCountry: builder.mutation<
      CountryDTO,
      { id: string; country: Partial<CountryDTO> }
    >({
      query: ({ id, country }) => ({
        url: `/settings/countries/${id}`,
        method: "PUT",
        body: country,
      }),
      invalidatesTags: ["COUNTRY"],
    }),
    deleteCountry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/settings/countries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["COUNTRY"],
    }),
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    getCities: builder.query<CityDTO[], RequestParamsType>({
      query: (params) => ({ url: "/settings/cities", params }),
      providesTags: ["CITY"],
    }),
    getCityById: builder.query<CityDTO, string>({
      query: (id) => `/settings/cities/${id}`,
      providesTags: ["CITY"],
    }),
    createCity: builder.mutation<void, CityDTO>({
      query: (city) => ({
        url: "/settings/cities",
        method: "POST",
        body: city,
      }),
      invalidatesTags: ["CITY", "COUNTRY"],
    }),
    updateCity: builder.mutation<void, { id: string; city: CityDTO }>({
      query: ({ id, city }) => ({
        url: `/settings/cities/${id}`,
        method: "PUT",
        body: city,
      }),
      invalidatesTags: ["CITY", "COUNTRY"],
    }),
    deleteCity: builder.mutation<void, string>({
      query: (id) => ({
        url: `/settings/cities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CITY", "COUNTRY"],
    }),
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    /* --------------------------------------------------- */
    getBagTypes: builder.query<BagTypeDTO[], void>({
      query: () => "settings/bagTypes",
      providesTags: ["BagType"],
    }),

    getBagTypeById: builder.query<BagTypeDTO, string>({
      query: (id) => `settings/bagTypes/${id}`,
      providesTags: (_res, _err, id) => [{ type: "BagType", id }],
    }),

    createBagType: builder.mutation<BagTypeDTO, Partial<BagTypeDTO>>({
      query: (bagType) => ({
        url: "settings/bagTypes",
        method: "POST",
        body: bagType,
      }),
      invalidatesTags: ["BagType"],
    }),

    updateBagType: builder.mutation<
      BagTypeDTO,
      { id: string; bagType: Partial<BagTypeDTO> }
    >({
      query: ({ id, bagType }) => ({
        url: `settings/bagTypes/${id}`,
        method: "PUT",
        body: bagType,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "BagType", id: arg.id },
        "BagType",
      ],
    }),

    deleteBagType: builder.mutation<void, string>({
      query: (id) => ({
        url: `settings/bagTypes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [{ type: "BagType", id }, "BagType"],
    }),
    getMarks: builder.query<MarkDTO[], void>({
      query: () => "settings/marks",
      providesTags: ["Mark"],
    }),
    getMarkById: builder.query<MarkDTO, string>({
      query: (id) => `settings/marks/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Mark", id }],
    }),
    createMark: builder.mutation<MarkDTO, Partial<MarkDTO>>({
      query: (mark) => ({
        url: "settings/marks",
        method: "POST",
        body: mark,
      }),
      invalidatesTags: ["Mark"],
    }),
    updateMark: builder.mutation<
      MarkDTO,
      { id: string; mark: Partial<MarkDTO> }
    >({
      query: ({ id, mark }) => ({
        url: `settings/marks/${id}`,
        method: "PUT",
        body: mark,
      }),
      invalidatesTags: () => [{ type: "Mark" }],
    }),
    deleteMark: builder.mutation<void, string>({
      query: (id) => ({
        url: `settings/marks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mark"],
    }),
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
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  useCreateConsigneeMutation,
  useUpdateConsigneeMutation,
  useDeleteConsigneeMutation,
  useGetConsigneeByIdQuery,
  useGetConsigneesQuery,

  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  useGetCitiesQuery,
  useGetCityByIdQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  useGetBagTypeByIdQuery,
  useCreateBagTypeMutation,
  useUpdateBagTypeMutation,
  useDeleteBagTypeMutation,
  useGetBagTypesQuery,
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  /* --------------------------------------------------- */
  useGetMarkByIdQuery,
  useGetMarksQuery,
  useCreateMarkMutation,
  useUpdateMarkMutation,
  useDeleteMarkMutation,
} = settingsApi;
