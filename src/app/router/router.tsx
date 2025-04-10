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
import { ProductionPage } from "@/features/production/planning/ProductionPage";
import { ProductionPlanningPage } from "@/features/production/production/ProductionPlanningPage";
import { QControlPage } from "@/features/production/quality-control/QCPage";
import { PurchaseFormPage } from "@/features/purchases/PurchaseFormPage";
import { PurchasePage } from "@/features/purchases/PurchasesPage";
import { CurrenciesPage } from "@/features/settings/currencies/CurrenciesPage";
import { UnitTypesPage } from "@/features/settings/unit-types/UnitTypesPage";
import { SuppliersPage } from "@/features/suppliers/SuppliersPage";
import { CategoryPage } from "@/features/warehouse/categories/CategoriesPage";
import { ProductPage } from "@/features/warehouse/products/ProductsPage";
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
        path: "statistics",
        element: <AIStatisticsPage />,
      },
      {
        path: "production/production-planning",
        element: <ProductionPlanningPage />,
      },
      {
        path: "production/production",
        element: <ProductionPage />,
      },
      {
        path: "production/quality-control",
        element: <QControlPage />,
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
        path: "clients",
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
        path: "purchases",
        element: <PurchasePage />,
      },
      {
        path: "purchases/new",
        element: <PurchaseFormPage />,
      },
      {
        path: "purchases/edit/:id",
        element: <PurchaseFormPage />,
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
        path: "warehouse/categories",
        element: <CategoryPage />,
      },
      {
        path: "warehouse/products",
        element: <ProductPage />,
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
