import { DepartmentPage } from "@/features/administrations/departments/DepartmentsPage";
import { FiancialAgentPage } from "@/features/ai-agents/agents/FiancialAgent";
import { InventoryAgentPage } from "@/features/ai-agents/agents/InventoryAgent";
import { LogisticsAgentPage } from "@/features/ai-agents/agents/LogisticsAgent";
import { ProductionAgentPage } from "@/features/ai-agents/agents/ProductionAgent";
import { PurchaseAgentPage } from "@/features/ai-agents/agents/PurchaseAgent";
import { SalesAgentPage } from "@/features/ai-agents/agents/SalesAgent";
import { AISettingsPage } from "@/features/ai-agents/AISettings";
import { KnowledgeBasePage } from "@/features/ai-agents/KnowledgeBase";
import { AIStatisticsPage } from "@/features/ai-agents/Statistics";
import { ClientPage } from "@/features/clients/ClientsPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import LoginPage from "@/features/LoginPage";
import { LogisticsPage } from "@/features/logistics/LogisticsPage";
import NotFoundPage from "@/features/NotFound";
import { ProductionOrdersPage } from "@/features/production/orders/ProductionOrders";
import { ProductionProcessesPage } from "@/features/production/processes/ProductionProcesses";
import { PurchasePage } from "@/features/purchases/PurchasesPage";
import { ClientOrdersPage } from "@/features/sales/ClientOrders";
import { CurrenciesPage } from "@/features/settings/currencies/CurrenciesPage";
import { UnitTypesPage } from "@/features/settings/unit-types/UnitTypesPage";
import { SuppliersPage } from "@/features/suppliers/SuppliersPage";
import { StockAnalyzePage } from "@/features/warehouse/analyze/StockAnalyze";
import { Fabricants } from "@/features/warehouse/fabricants/FabricantsPage";
import { HelperFabricantsPage } from "@/features/warehouse/helper-fabricants/HelperFabricantsPage";
import { TransferItems } from "@/features/warehouse/transfers/Transfers";
import { MainLayout } from "@/lib/layout/MainLayout";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "production",
        children: [
          {
            path: "orders",
            element: <ProductionOrdersPage />,
          },
          {
            path: "processes",
            element: <ProductionProcessesPage />,
          },
        ],
      },
      {
        path: "warehouse",
        children: [
          {
            path: "analyze",
            element: <StockAnalyzePage />,
          },
          {
            path: "fabricants",
            element: <Fabricants />,
          },
          {
            path: "helper-fabricants",
            element: <HelperFabricantsPage />,
          },
          {
            path: "transfer-items",
            element: <TransferItems />,
          },
        ],
      },
      {
        path: "statistics",
        element: <AIStatisticsPage />,
      },
      {
        path: "knowledge-base",
        element: <KnowledgeBasePage />,
      },
      {
        path: "ai-settings",
        element: <AISettingsPage />,
      },
      {
        path: "agents/financial-agent",
        element: <FiancialAgentPage />,
      },
      {
        path: "agents/logistics-agent",
        element: <LogisticsAgentPage />,
      },
      {
        path: "agents/inventory-agent",
        element: <InventoryAgentPage />,
      },
      {
        path: "agents/sales-agent",
        element: <SalesAgentPage />,
      },
      {
        path: "agents/purchasing-agent",
        element: <PurchaseAgentPage />,
      },
      {
        path: "agents/production-agent",
        element: <ProductionAgentPage />,
      },
      {
        path: "sales/clients",
        element: <ClientPage />,
      },
      {
        path: "suppliers",
        element: <SuppliersPage />,
      },
      {
        path: "suppliers",
        element: <SuppliersPage />,
      },
      {
        path: "settings/unitTypes",
        element: <UnitTypesPage />,
      },
      {
        path: "settings/currencies",
        element: <CurrenciesPage />,
      },
      {
        path: "warehouse/acceptance-orders",
        element: <PurchasePage />,
      },

      {
        path: "sales/client-orders",
        element: <ClientOrdersPage />,
      },
      {
        path: "logistics",
        element: <LogisticsPage />,
      },
      {
        path: "administration/departments",
        element: <DepartmentPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "auth",
    element: <LoginPage />,
  },
]);
