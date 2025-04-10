import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./lib/styles/global.css";
import "./lib/i18n";
import "@ant-design/v5-patch-for-react-19";
import { App } from "./app/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
