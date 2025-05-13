import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "./services/auth.service";
import authSlice from "./slices/auth.slice";
import { clientsApi } from "./services/clients.api";
import { suppliersApi } from "./services/suppliers.api";
import { settingsApi } from "./services/settings.api";
import { warehouseApi } from "./services/warehouse.service";
import { purchasesApi } from "./services/purchase.api";
import { adminApi } from "./services/admin";
import uiSlice from "./slices/ui.slice";
import { salesApi } from "./services/sales.api";

export const reducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [clientsApi.reducerPath]: clientsApi.reducer,
  [suppliersApi.reducerPath]: suppliersApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [warehouseApi.reducerPath]: warehouseApi.reducer,
  [purchasesApi.reducerPath]: purchasesApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [salesApi.reducerPath]: salesApi.reducer,
  auth: authSlice,
  ui: uiSlice,
});
