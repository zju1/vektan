import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { ConfigProvider, App as AntApp } from "antd";
import "@fontsource-variable/inter/index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.config";
import { Toaster } from "@/components/ui/toaster";

export function App() {
  return (
    <ConfigProvider
      typography={{
        style: {
          fontFamily: "'Inter Variable', sans-serif",
        },
      }}
      theme={{
        token: {
          colorPrimary: "#083868",
        },
        components: {
          Button: {
            primaryShadow: "none",
          },
        },
      }}
    >
      <AntApp>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <RouterProvider router={router} />
            <Toaster />
          </PersistGate>
        </Provider>
      </AntApp>
    </ConfigProvider>
  );
}
