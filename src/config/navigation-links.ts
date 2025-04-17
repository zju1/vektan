import {
  LayoutDashboard,
  DollarSign,
  Factory,
  Package,
  Shield,
  Settings,
  Bot,
  Book,
  Cog,
  ChartArea,
  ShoppingCart,
} from "lucide-react";

export const navigationData = {
  navMain: [
    {
      title: "dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "purchases",
      icon: ShoppingCart,
      items: [
        {
          title: "purchaseItems",
          url: "/purchases/orders",
        },
        {
          title: "suppliers",
          url: "/purchases/suppliers",
        },
        {
          title: "priceHistory",
          url: "/purchases/price-history",
        },
        {
          title: "stockAnalysis",
          url: "/purchases/stock-analysis",
        },
      ],
    },
    {
      title: "sale",
      icon: DollarSign,
      items: [
        {
          title: "logistics",
          url: "/sales/logistics",
        },
        {
          title: "clientOrders",
          url: "/sales/client-orders",
        },
        {
          title: "clients",
          url: "/sales/clients",
        },
        {
          title: "shipments",
          url: "/sales/shipments",
        },
      ],
    },
    {
      title: "production",
      icon: Factory,
      items: [
        {
          title: "autoPlanning",
          url: "/production/auto-planning",
        },
        {
          title: "productionPlanning",
          url: "/production/planning",
        },
        {
          title: "production",
          url: "/production/production",
        },
        {
          title: "qualityControl",
          url: "/production/quality-control",
        },
      ],
    },
    {
      title: "warehouse",
      icon: Package,
      items: [
        {
          title: "categories",
          url: "/warehouse/categories",
        },
        {
          title: "products",
          url: "/warehouse/products",
        },
        {
          title: "acceptanceOfProducts",
          url: "/warehouse/acceptance-orders",
        },
        {
          title: "transfer-orders",
          url: "/warehouse/transfer-orders",
        },
      ],
    },
    {
      title: "administration",
      icon: Shield,
      items: [
        {
          title: "departments",
          url: "/administration/departments",
        },
        {
          title: "users",
          url: "/administration/users",
        },
      ],
    },
    {
      title: "settings",
      icon: Settings,
      items: [
        {
          title: "unitTypes",
          url: "/settings/unitTypes",
        },
        {
          title: "currencies",
          url: "/settings/currencies",
        },
        {
          title: "roles",
          url: "/settings/roles",
        },
      ],
    },
  ],
  navAgents: [
    {
      title: "statistics",
      icon: ChartArea,
      url: "/statistics",
    },
    {
      title: "agents",
      icon: Bot,
      items: [
        {
          title: "financialAgent",
          url: "/agents/financial-agent",
        },
        {
          title: "inventoryAgent",
          url: "/agents/inventory-agent",
        },
        {
          title: "logisticsAgent",
          url: "/agents/logistics-agent",
        },
        {
          title: "salesAgent",
          url: "/agents/sales-agent",
        },
        {
          title: "purchasingAgent",
          url: "/agents/purchasing-agent",
        },
        {
          title: "productionAgent",
          url: "/agents/production-agent",
        },
      ],
    },
    {
      title: "knowledgeBase",
      icon: Book,
      url: "/knowledge-base",
    },
    {
      title: "aiSettings",
      icon: Cog,
      url: "/ai-settings",
    },
  ],
};
