import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store.config";
import { envVariables } from "@/config/env";
import type { DepartmentDTO } from "@/features/administrations/departments/department.dto";
import type { EmployeeDTO } from "@/features/administrations/employees/employee.dto";

export const adminApi = createApi({
  reducerPath: "adminApi",
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
  tagTypes: ["DEPARTMENTS", "EMPLOYEES"],
  endpoints: (builder) => ({
    /* ====================================================================== */
    /* ====================================================================== */
    /* ====================================================================== */
    /* ====================================================================== */
    /* ====================================================================== */
    getDepartments: builder.query<DepartmentDTO[], void>({
      query: () => ({
        url: "administration/departments",
      }),
      providesTags: ["DEPARTMENTS"],
    }),
    getDepartmentById: builder.query<DepartmentDTO, string | null>({
      query: (id) => ({
        url: `administration/departments/${id}`,
      }),
    }),
    createDepartment: builder.mutation<unknown, DepartmentDTO>({
      query: (body) => ({
        url: "administration/departments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DEPARTMENTS"],
    }),
    updateDepartment: builder.mutation<
      unknown,
      { department: DepartmentDTO; id: string }
    >({
      query: ({ department: body, id }) => ({
        url: `administration/departments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DEPARTMENTS"],
    }),
    deleteDepartment: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `administration/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DEPARTMENTS"],
    }),
    /* ====================================================================== */
    /* ====================================================================== */
    /* ====================================================================== */
    /* ====================================================================== */
    /* ====================================================================== */
    getEmployees: builder.query<EmployeeDTO[], void>({
      query: () => ({
        url: "administration/employees",
      }),
      providesTags: ["EMPLOYEES"],
    }),
    getEmployeeById: builder.query<EmployeeDTO, string | null>({
      query: (id) => ({
        url: `administration/employees/${id}`,
      }),
    }),
    createEmployee: builder.mutation<unknown, EmployeeDTO>({
      query: (body) => ({
        url: "administration/employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EMPLOYEES"],
    }),
    updateEmployee: builder.mutation<
      unknown,
      { item: EmployeeDTO; id: string }
    >({
      query: ({ item: body, id }) => ({
        url: `administration/employees/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EMPLOYEES"],
    }),
    deleteEmployee: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `administration/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EMPLOYEES"],
    }),
    /* ====================================================================== */
    /* ====================================================================== */
    /* ====================================================================== */
    /* ====================================================================== */
    /* ====================================================================== */
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  /* ====================================================================== */
  /* ====================================================================== */
  /* ====================================================================== */
  /* ====================================================================== */
  /* ====================================================================== */
  useGetEmployeeByIdQuery,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = adminApi;
