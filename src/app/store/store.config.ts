import {
  persistReducer,
  PersistConfig,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "./services/auth.service";
import { reducer } from "./reducer";
import { authMiddleWare } from "./middlewares/auth.middleware";
import { clientsApi } from "./services/clients.api";
import { suppliersApi } from "./services/suppliers.api";
import { envVariables } from "@/config/env";
import { settingsApi } from "./services/settings.api";
import { warehouseApi } from "./services/warehouse.service";
import { purchasesApi } from "./services/purchase.api";
import { adminApi } from "./services/admin";

const persistConfig: PersistConfig<any> = {
  key: "root",
  storage,
  blacklist: [
    authApi.reducerPath,
    clientsApi.reducerPath,
    suppliersApi.reducerPath,
    settingsApi.reducerPath,
    warehouseApi.reducerPath,
    purchasesApi.reducerPath,
    adminApi.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, reducer as any);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: !envVariables.IS_PRODUCTION,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      clientsApi.middleware,
      suppliersApi.middleware,
      settingsApi.middleware,
      warehouseApi.middleware,
      purchasesApi.middleware,
      adminApi.middleware,
      authMiddleWare
    );
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
