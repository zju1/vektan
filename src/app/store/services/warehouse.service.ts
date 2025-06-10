import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import type { CategoryDTO } from "@/features/warehouse/categories/category.dto";
import type { ProductDTO } from "@/features/warehouse/products/product.dto";
import type { MarkAsPackedDTO } from "@/features/production/processes/production-process.dto";
import type { IProducedMaterial } from "@/features/warehouse/ready-products/ready-products.dto";

export const warehouseApi = createApi({
  reducerPath: "warehouseApi",
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
  tagTypes: ["CATEGORIES", "PRODUCTS", "PRODUCED_ITEMS"],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryDTO[], void>({
      query: () => ({
        url: "warehouse/categories",
      }),
      providesTags: ["CATEGORIES"],
    }),
    getCategoryById: builder.query<CategoryDTO, string | null>({
      query: (id) => ({
        url: `warehouse/categories/${id}`,
      }),
    }),
    createCategory: builder.mutation<unknown, CategoryDTO>({
      query: (body) => ({
        url: "warehouse/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CATEGORIES"],
    }),
    updateCategory: builder.mutation<
      unknown,
      { category: CategoryDTO; id: string }
    >({
      query: ({ category: body, id }) => ({
        url: `warehouse/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CATEGORIES"],
    }),
    deleteCategory: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `warehouse/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CATEGORIES"],
    }),
    /* -------------------------------------------------- */
    /* -------------------------------------------------- */
    /* -------------------------------------------------- */
    /* -------------------------------------------------- */
    /* -------------------------------------------------- */
    getProducts: builder.query<ProductDTO[], void>({
      query: () => ({
        url: "warehouse/products",
      }),
      providesTags: ["PRODUCTS"],
    }),
    getProductById: builder.query<ProductDTO, string | null>({
      query: (id) => ({
        url: `warehouse/products/${id}`,
      }),
    }),
    createProduct: builder.mutation<unknown, ProductDTO>({
      query: (body) => ({
        url: "warehouse/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PRODUCTS"],
    }),
    updateProduct: builder.mutation<
      unknown,
      { product: ProductDTO; id: string }
    >({
      query: ({ product: body, id }) => ({
        url: `warehouse/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PRODUCTS"],
    }),
    deleteProduct: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `warehouse/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCTS"],
    }),
    /* -------------------------------------------------- */
    /* -------------------------------------------------- */
    /* -------------------------------------------------- */
    /* -------------------------------------------------- */
    /* -------------------------------------------------- */
    getProducedItems: builder.query<IProducedMaterial[], void>({
      query: () => ({
        url: "warehouse/pm",
      }),
      providesTags: ["PRODUCED_ITEMS"],
    }),
    getProducedItemById: builder.query<ProductDTO, string | null>({
      query: (id) => ({
        url: `warehouse/pm/${id}`,
      }),
    }),
    createProducedItem: builder.mutation<unknown, MarkAsPackedDTO>({
      query: (body) => ({
        url: "warehouse/pm",
        method: "POST",
        body,
      }),
      invalidatesTags: () => {
        return ["PRODUCED_ITEMS"];
      },
    }),
    updateProducedItem: builder.mutation<
      unknown,
      { product: ProductDTO; id: string }
    >({
      query: ({ product: body, id }) => ({
        url: `warehouse/pm/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PRODUCTS"],
    }),
    deleteProducedItem: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `warehouse/pm/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCTS"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  useCreateProducedItemMutation,
  useGetProducedItemsQuery,
} = warehouseApi;
