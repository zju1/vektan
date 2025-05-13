import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import { IClientOrder } from "@/features/sales/ClientOrders";
import { RequestParamsType } from "@/@types";
import type { ProductionOrder } from "@/features/production/orders/ProductionOrders";
import type { ProcessData } from "@/features/production/processes/ProductionProcesses";
import type { StockItem } from "@/features/warehouse/analyze/StockAnalyze";
import type { MaterialData } from "@/features/warehouse/fabricants/FabricantsPage";
import type { RawMaterialData } from "@/features/warehouse/helper-fabricants/HelperFabricantsPage";
import type { TransferItem } from "antd/es/transfer";

export const salesApi = createApi({
  reducerPath: "salesApi",
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
    "CLIENT_ORDERS",
    "PRODUCTION_ORDERS",
    "PROCESS_DATA",
    "STOCK_ANALYSYS",
    "PURCHASE_FABRICANTS",
    "HELPING_MATERIALS",
    "TRANSFER_ITEMS",
  ],
  endpoints: (builder) => ({
    //#region CLIENT ORDERS
    getClientOrders: builder.query<IClientOrder[], RequestParamsType>({
      query: (params) => ({
        params,
        url: "client-orders",
      }),
      providesTags: ["CLIENT_ORDERS"],
    }),
    createClientOrder: builder.mutation<IClientOrder, IClientOrder>({
      query: (body) => ({
        body,
        url: "client-orders",
        method: "POST",
      }),
      invalidatesTags: ["CLIENT_ORDERS"],
    }),
    updateClientOrder: builder.mutation<IClientOrder, IClientOrder>({
      query: ({ _id, ...body }) => ({
        body,
        url: `client-orders/${_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["CLIENT_ORDERS"],
    }),
    deleteClientOrder: builder.mutation<IClientOrder, string>({
      query: (id) => ({
        url: `client-orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CLIENT_ORDERS"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region PRODUCTION ORDERS
    getProductionrders: builder.query<ProductionOrder[], RequestParamsType>({
      query: (params) => ({
        params,
        url: "production-orders",
      }),
      providesTags: ["PRODUCTION_ORDERS"],
    }),
    createProductionOrder: builder.mutation<ProductionOrder, ProductionOrder>({
      query: (body) => ({
        body,
        url: "production-orders",
        method: "POST",
      }),
      invalidatesTags: ["PRODUCTION_ORDERS"],
    }),
    updateProductionOrder: builder.mutation<ProductionOrder, ProductionOrder>({
      query: ({ _id, ...body }) => ({
        body,
        url: `production-orders/${_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["PRODUCTION_ORDERS"],
    }),
    deleteProductionOrder: builder.mutation<ProductionOrder, string>({
      query: (id) => ({
        url: `production-orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCTION_ORDERS"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region PROCESS DATA
    getProcessData: builder.query<ProcessData[], RequestParamsType>({
      query: (params) => ({
        params,
        url: "process-data",
      }),
      providesTags: ["PROCESS_DATA"],
    }),
    createProcessData: builder.mutation<ProcessData, ProcessData>({
      query: (body) => ({
        body,
        url: "process-data",
        method: "POST",
      }),
      invalidatesTags: ["PROCESS_DATA"],
    }),
    updateProcesData: builder.mutation<ProcessData, ProcessData>({
      query: ({ _id, ...body }) => ({
        body,
        url: `process-data/${_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["PROCESS_DATA"],
    }),
    deleteProcessData: builder.mutation<ProcessData, string>({
      query: (id) => ({
        url: `process-data/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PROCESS_DATA"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region STOCK ANALYSYS DATA
    getStockAnalyzes: builder.query<StockItem[], RequestParamsType>({
      query: (params) => ({
        params,
        url: "warehouse/stock-analysys",
      }),
      providesTags: ["STOCK_ANALYSYS"],
    }),
    createStockAnalyze: builder.mutation<StockItem, StockItem>({
      query: (body) => ({
        body,
        url: "warehouse/stock-analysys",
        method: "POST",
      }),
      invalidatesTags: ["STOCK_ANALYSYS"],
    }),
    updateStockAnalyze: builder.mutation<StockItem, StockItem>({
      query: ({ _id, ...body }) => ({
        body,
        url: `warehouse/stock-analysys/${_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["STOCK_ANALYSYS"],
    }),
    deleteStockAnalyze: builder.mutation<StockItem, string>({
      query: (id) => ({
        url: `warehouse/stock-analysys/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["STOCK_ANALYSYS"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region PURCHASE FABRICANTS DATA
    getPurchaseFabricants: builder.query<MaterialData[], RequestParamsType>({
      query: (params) => ({
        params,
        url: "warehouse/purchase-fabricant",
      }),
      providesTags: ["PURCHASE_FABRICANTS"],
    }),
    createPurchaseFabricant: builder.mutation<MaterialData, MaterialData>({
      query: (body) => ({
        body,
        url: "warehouse/purchase-fabricant",
        method: "POST",
      }),
      invalidatesTags: ["PURCHASE_FABRICANTS"],
    }),
    updatePurchaseFabricant: builder.mutation<MaterialData, MaterialData>({
      query: ({ _id, ...body }) => ({
        body,
        url: `warehouse/purchase-fabricant/${_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["PURCHASE_FABRICANTS"],
    }),
    deletePurchaseFabricant: builder.mutation<MaterialData, string>({
      query: (id) => ({
        url: `warehouse/purchase-fabricant/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PURCHASE_FABRICANTS"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region HELPING MATERIALS ANALYSYS DATA
    getHelpingMaterials: builder.query<RawMaterialData[], RequestParamsType>({
      query: (params) => ({
        params,
        url: "warehouse/helping-material",
      }),
      providesTags: ["HELPING_MATERIALS"],
    }),
    createHelpingMaterial: builder.mutation<RawMaterialData, RawMaterialData>({
      query: (body) => ({
        body,
        url: "warehouse/helping-material",
        method: "POST",
      }),
      invalidatesTags: ["HELPING_MATERIALS"],
    }),
    updateHelpingMaterial: builder.mutation<RawMaterialData, RawMaterialData>({
      query: ({ _id, ...body }) => ({
        body,
        url: `warehouse/helping-material/${_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["HELPING_MATERIALS"],
    }),
    deleteHelpingMaterial: builder.mutation<RawMaterialData, string>({
      query: (id) => ({
        url: `warehouse/helping-material/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HELPING_MATERIALS"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region TRANSFER ITEMS
    getTransferItems: builder.query<TransferItem[], RequestParamsType>({
      query: (params) => ({
        params,
        url: "warehouse/transfer",
      }),
      providesTags: ["TRANSFER_ITEMS"],
    }),
    createTransferItem: builder.mutation<TransferItem, TransferItem>({
      query: (body) => ({
        body,
        url: "warehouse/transfer",
        method: "POST",
      }),
      invalidatesTags: ["TRANSFER_ITEMS"],
    }),
    updateTransferItem: builder.mutation<TransferItem, TransferItem>({
      query: ({ _id, ...body }) => ({
        body,
        url: `warehouse/transfer/${_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["TRANSFER_ITEMS"],
    }),
    deleteTransferItem: builder.mutation<TransferItem, string>({
      query: (id) => ({
        url: `warehouse/transfer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TRANSFER_ITEMS"],
    }),
    //#endregion
  }),
});

export const {
  useGetClientOrdersQuery,
  useCreateClientOrderMutation,
  useUpdateClientOrderMutation,
  useDeleteClientOrderMutation,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useGetProductionrdersQuery,
  useUpdateProductionOrderMutation,
  useCreateProductionOrderMutation,
  useDeleteProductionOrderMutation,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useCreateProcessDataMutation,
  useUpdateProcesDataMutation,
  useDeleteProcessDataMutation,
  useGetProcessDataQuery,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useCreateStockAnalyzeMutation,
  useUpdateStockAnalyzeMutation,
  useDeleteStockAnalyzeMutation,
  useGetStockAnalyzesQuery,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useCreatePurchaseFabricantMutation,
  useUpdatePurchaseFabricantMutation,
  useDeletePurchaseFabricantMutation,
  useGetPurchaseFabricantsQuery,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useGetHelpingMaterialsQuery,
  useCreateHelpingMaterialMutation,
  useUpdateHelpingMaterialMutation,
  useDeleteHelpingMaterialMutation,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useCreateTransferItemMutation,
  useUpdateTransferItemMutation,
  useGetTransferItemsQuery,
  useDeleteTransferItemMutation,
} = salesApi;
