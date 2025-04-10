import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import type { ClientDTO } from "@/features/clients/client.dto";

export const clientsApi = createApi({
  reducerPath: "clientsApi",
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
  tagTypes: ["CLIENTS", "PRODUCTS", "SUPPLIERS"],
  endpoints: (builder) => ({
    getClients: builder.query<ClientDTO[], void>({
      query: () => ({
        url: "crm/clients",
      }),
      providesTags: ["CLIENTS"],
    }),
    getClientById: builder.query<ClientDTO, string | null>({
      query: (id) => ({
        url: `crm/clients/${id}`,
      }),
    }),
    createClient: builder.mutation<unknown, ClientDTO>({
      query: (body) => ({
        url: "crm/clients",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CLIENTS"],
    }),
    updateClient: builder.mutation<unknown, { client: ClientDTO; id: string }>({
      query: ({ client: body, id }) => ({
        url: `crm/clients/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CLIENTS"],
    }),
    deleteClient: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `crm/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CLIENTS"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
