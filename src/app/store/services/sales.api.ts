import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import { IClientOrder } from "@/features/sales/ClientOrders";
import { RequestParamsType } from "@/@types";
import type { StockItem } from "@/features/warehouse/analyze/StockAnalyze";
import type { MaterialData } from "@/features/warehouse/fabricants/FabricantsPage";
import type { RawMaterialData } from "@/features/warehouse/helper-fabricants/HelperFabricantsPage";
import type { TransferItem } from "antd/es/transfer";
import type { LogisticsReportDTO } from "@/features/sales/logistics-report/logistics-report.dto";
import type { LogisticsTrackingDTO } from "@/features/sales/logistics-tracking/logisticsTracking.dto";
import type { MutualSettlementVectanIlcaDTO } from "@/features/sales/msvil/msvil.dto";
import type { MuseVectanAndOtherDTO } from "@/features/sales/msvo/muse-vectan-and-other.dto";
import type { MutualSettlementsILCAOtherDTO } from "@/features/sales/msio/mutual-settlements-ilca-other.dto";
import type {
  IProductionOrder,
  SingleProductionOrder,
} from "@/features/sales/production-orders/production-order.dto";
import type {
  RecipeModelDTO,
  SingleRecipe,
} from "@/features/production/recipes/recipe.dto";
import {
  SingleProductionJournal,
  type IProductionJournal,
} from "@/features/production/processes/production-process.dto";
import type {
  IProductionQA,
  SingleProductionQA,
} from "@/features/production/laboratory/production-lab.dto";
import type {
  ShipmentDTO,
  SingleShipment,
} from "@/features/sales/shipments/shipment.dto";
import type {
  IShipmentReport,
  ShipmentReportDTO,
} from "@/features/sales/shipment-reports/shipment-report.dto";

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
    "LOGISTICS_REPORT",
    "LOGISTICS_TRACKINGS",
    "MutualSettlementVectanIlca",
    "MuseVectanAndOther",
    "mutual-settlements-ilca-other",
    "Recipes",
    "ProductionJournal",
    "ProductionLab",
    "Shipments",
    "ShipmentReport",
  ],
  endpoints: (builder) => ({
    getRecipeModels: builder.query<SingleRecipe[], void>({
      query: () => "/recipe",
      providesTags: ["Recipes"],
    }),
    getRecipeModelById: builder.query<
      RecipeModelDTO,
      { id: string; po?: string }
    >({
      query: ({ id }) => `/recipe/${id}`,
    }),
    createRecipeModel: builder.mutation<void, RecipeModelDTO>({
      query: (recipe) => ({
        url: "/recipe",
        method: "POST",
        body: recipe,
      }),
      invalidatesTags: ["Recipes"],
    }),
    updateRecipeModel: builder.mutation<
      void,
      { id: string; recipe: RecipeModelDTO }
    >({
      query: ({ id, recipe }) => ({
        url: `/recipe/${id}`,
        method: "PUT",
        body: recipe,
      }),
      invalidatesTags: ["Recipes"],
    }),
    deleteRecipeModel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/recipe/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Recipes"],
    }),
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
    getProductionrders: builder.query<
      SingleProductionOrder[],
      RequestParamsType
    >({
      query: (params) => ({
        params,
        url: "production-orders",
      }),
      providesTags: ["PRODUCTION_ORDERS"],
    }),
    getProductionrderById: builder.query<IProductionOrder, string>({
      query: (id) => ({
        url: `production-orders/${id}`,
      }),
    }),
    createProductionOrder: builder.mutation<IProductionOrder, IProductionOrder>(
      {
        query: (body) => ({
          body,
          url: "production-orders",
          method: "POST",
        }),
        invalidatesTags: ["PRODUCTION_ORDERS"],
      }
    ),
    updateProductionOrder: builder.mutation<
      IProductionOrder,
      Required<IProductionOrder>
    >({
      query: ({ _id, ...body }) => ({
        body,
        url: `production-orders/${_id}`,
        method: "PUT",
      }),
      invalidatesTags: ["PRODUCTION_ORDERS"],
    }),
    changeProductionOrder: builder.mutation<
      IProductionOrder,
      Partial<IProductionOrder>
    >({
      query: ({ _id, ...body }) => ({
        body,
        url: `production-orders/${_id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["PRODUCTION_ORDERS", "Recipes"],
    }),
    deleteProductionOrder: builder.mutation<IProductionOrder, string>({
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
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region LOGISTICS REPORTS
    getLogisticsReport: builder.query<LogisticsReportDTO[], void>({
      query: () => "/logistics-report",
      providesTags: ["LOGISTICS_REPORT"],
    }),
    getLogisticsReportById: builder.query<LogisticsReportDTO, string>({
      query: (id) => `/logistics-report/${id}`,
      providesTags: (_result, _error, id) => [{ type: "LOGISTICS_REPORT", id }],
    }),
    createLogisticsReport: builder.mutation<void, LogisticsReportDTO>({
      query: (report) => ({
        url: "/logistics-report",
        method: "POST",
        body: report,
      }),
      invalidatesTags: ["LOGISTICS_REPORT"],
    }),
    updateLogisticsReport: builder.mutation<
      void,
      { id: string; report: LogisticsReportDTO }
    >({
      query: ({ id, report }) => ({
        url: `/logistics-report/${id}`,
        method: "PUT",
        body: report,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "LOGISTICS_REPORT",
        { type: "LOGISTICS_REPORT", id },
      ],
    }),
    deleteLogisticsReport: builder.mutation<void, string>({
      query: (id) => ({
        url: `/logistics-report/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LOGISTICS_REPORT"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region LOGISTICS TRACKING
    getLogisticsTrackings: builder.query<LogisticsTrackingDTO[], void>({
      query: () => "/logistics-tracking",
      providesTags: ["LOGISTICS_TRACKINGS"],
    }),

    getLogisticsTrackingById: builder.query<LogisticsTrackingDTO, string>({
      query: (id) => `/logistics-tracking/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "LOGISTICS_TRACKINGS", id },
      ],
    }),

    createLogisticsTracking: builder.mutation<void, LogisticsTrackingDTO>({
      query: (tracking) => ({
        url: "/logistics-tracking",
        method: "POST",
        body: tracking,
      }),
      invalidatesTags: ["LOGISTICS_TRACKINGS"],
    }),

    updateLogisticsTracking: builder.mutation<
      void,
      { id: string; tracking: LogisticsTrackingDTO }
    >({
      query: ({ id, tracking }) => ({
        url: `/logistics-tracking/${id}`,
        method: "PUT",
        body: tracking,
      }),
      invalidatesTags: ["LOGISTICS_TRACKINGS"],
    }),

    deleteLogisticsTracking: builder.mutation<void, string>({
      query: (id) => ({
        url: `/logistics-tracking/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LOGISTICS_TRACKINGS"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region MUTUAL SETTLEMENT VECTAN ILCA
    getMutualSettlementVectanIlcas: builder.query<
      MutualSettlementVectanIlcaDTO[],
      void
    >({
      query: () => ({ url: "msvil" }),
      providesTags: ["MutualSettlementVectanIlca"],
    }),

    getMutualSettlementVectanIlcaById: builder.query<
      MutualSettlementVectanIlcaDTO,
      string
    >({
      query: (id) => `msvil/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "MutualSettlementVectanIlca", id },
      ],
    }),

    createMutualSettlementVectanIlca: builder.mutation<
      void,
      MutualSettlementVectanIlcaDTO
    >({
      query: (body) => ({
        url: "msvil",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MutualSettlementVectanIlca"],
    }),

    updateMutualSettlementVectanIlca: builder.mutation<
      void,
      { id: string; data: Partial<MutualSettlementVectanIlcaDTO> }
    >({
      query: ({ id, data }) => ({
        url: `msvil/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["MutualSettlementVectanIlca"],
    }),

    deleteMutualSettlementVectanIlca: builder.mutation<void, string>({
      query: (id) => ({
        url: `msvil/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MutualSettlementVectanIlca"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region MUSE VECTAN AND OTHER
    getMuseVectanAndOthers: builder.query<MuseVectanAndOtherDTO[], void>({
      query: () => "/msvo",
      providesTags: ["MuseVectanAndOther"],
    }),
    getMuseVectanAndOtherById: builder.query<MuseVectanAndOtherDTO, string>({
      query: (id) => `/msvo/${id}`,
      providesTags: ["MuseVectanAndOther"],
    }),
    createMuseVectanAndOther: builder.mutation<
      void,
      Partial<MuseVectanAndOtherDTO>
    >({
      query: (msvo) => ({
        url: "/msvo",
        method: "POST",
        body: msvo,
      }),
      invalidatesTags: ["MuseVectanAndOther"],
    }),
    updateMuseVectanAndOther: builder.mutation<
      void,
      { id: string; msvo: Partial<MuseVectanAndOtherDTO> }
    >({
      query: ({ id, msvo }) => ({
        url: `/msvo/${id}`,
        method: "PUT",
        body: msvo,
      }),
      invalidatesTags: ["MuseVectanAndOther"],
    }),
    deleteMuseVectanAndOther: builder.mutation<void, string>({
      query: (id) => ({
        url: `/msvo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MuseVectanAndOther"],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region MUTUAL SETTLEMENTS ILCA OTHER
    getMutualSettlementsILCAOther: builder.query<
      MutualSettlementsILCAOtherDTO[],
      void
    >({
      query: () => "/msio",
      providesTags: ["mutual-settlements-ilca-other"],
    }),

    getMutualSettlementsILCAOtherById: builder.query<
      MutualSettlementsILCAOtherDTO,
      string
    >({
      query: (id) => `/msio/${id}`,
      providesTags: (_res, _err, id) => [
        { type: "mutual-settlements-ilca-other", id },
      ],
    }),

    createMutualSettlementsILCAOther: builder.mutation<
      void,
      Partial<MutualSettlementsILCAOtherDTO>
    >({
      query: (msio) => ({
        url: "/msio",
        method: "POST",
        body: msio,
      }),
      invalidatesTags: ["mutual-settlements-ilca-other"],
    }),

    updateMutualSettlementsILCAOther: builder.mutation<
      void,
      { id: string; data: Partial<MutualSettlementsILCAOtherDTO> }
    >({
      query: ({ id, data }) => ({
        url: `/msio/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        "mutual-settlements-ilca-other",
        { type: "mutual-settlements-ilca-other", id },
      ],
    }),

    deleteMutualSettlementsILCAOther: builder.mutation<void, string>({
      query: (id) => ({
        url: `/msio/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        "mutual-settlements-ilca-other",
        { type: "mutual-settlements-ilca-other", id },
      ],
    }),
    //#endregion
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    /* ======================================================== */
    //#region Production Journal
    getProductionJournal: builder.query<SingleProductionJournal[], void>({
      query: () => `prod-journal`,
      providesTags: ["ProductionJournal"],
    }),
    updateProductJournal: builder.mutation<
      SingleProductionJournal,
      Partial<IProductionJournal>
    >({
      query: (body) => ({
        url: `prod-journal/${body._id}`,
        body,
        method: "PUT",
      }),
      invalidatesTags: ["ProductionJournal"],
    }),
    //#endregion
    getLaboratoryJournal: builder.query<SingleProductionQA[], void>({
      query: () => `prod-qa`,
      providesTags: ["ProductionLab"],
    }),
    updateLaboratoryJournal: builder.mutation<
      SingleProductionQA,
      Partial<IProductionQA>
    >({
      query: (body) => ({
        url: `prod-qa/${body._id}`,
        body,
        method: "PUT",
      }),
      invalidatesTags: ["ProductionLab"],
    }),
    getShipments: builder.query<SingleShipment[], void>({
      query: () => `shipments`,
      providesTags: ["Shipments"],
    }),
    createShipment: builder.mutation<SingleShipment, ShipmentDTO>({
      query: (body) => ({
        url: `shipments`,
        body,
        method: "POST",
      }),
      invalidatesTags: ["Shipments"],
    }),
    getShipmentReports: builder.query<IShipmentReport[], RequestParamsType>({
      query: (params) => ({
        url: `shipment-report`,
        params,
      }),
      providesTags: ["ShipmentReport"],
    }),
    createShipmentReport: builder.mutation<IShipmentReport, ShipmentReportDTO>({
      query: (body) => ({
        url: `shipment-report`,
        body,
        method: "POST",
      }),
      invalidatesTags: ["ShipmentReport", "Shipments"],
    }),
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
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useGetLogisticsReportByIdQuery,
  useCreateLogisticsReportMutation,
  useDeleteLogisticsReportMutation,
  useGetLogisticsReportQuery,
  useUpdateLogisticsReportMutation,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useGetLogisticsTrackingByIdQuery,
  useGetLogisticsTrackingsQuery,
  useCreateLogisticsTrackingMutation,
  useUpdateLogisticsTrackingMutation,
  useDeleteLogisticsTrackingMutation,

  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useGetMutualSettlementVectanIlcaByIdQuery,
  useGetMutualSettlementVectanIlcasQuery,
  useCreateMutualSettlementVectanIlcaMutation,
  useUpdateMutualSettlementVectanIlcaMutation,
  useDeleteMutualSettlementVectanIlcaMutation,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useCreateMuseVectanAndOtherMutation,
  useUpdateMuseVectanAndOtherMutation,
  useDeleteMuseVectanAndOtherMutation,
  useGetMuseVectanAndOtherByIdQuery,
  useGetMuseVectanAndOthersQuery,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useGetMutualSettlementsILCAOtherByIdQuery,
  useGetMutualSettlementsILCAOtherQuery,
  useCreateMutualSettlementsILCAOtherMutation,
  useUpdateMutualSettlementsILCAOtherMutation,
  useDeleteMutualSettlementsILCAOtherMutation,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useGetProductionrderByIdQuery,
  useChangeProductionOrderMutation,
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  /* ============================================================= */
  useGetRecipeModelByIdQuery,
  useGetRecipeModelsQuery,
  useCreateRecipeModelMutation,
  useUpdateRecipeModelMutation,
  useDeleteRecipeModelMutation,
  useGetProductionJournalQuery,
  useGetLaboratoryJournalQuery,
  useUpdateProductJournalMutation,
  useUpdateLaboratoryJournalMutation,
  useGetShipmentsQuery,
  useCreateShipmentMutation,
  useCreateShipmentReportMutation,
  useGetShipmentReportsQuery,
} = salesApi;
