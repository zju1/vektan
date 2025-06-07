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
          title: "purchaseRequests",
          url: "/purchases/purchase-requests",
        },
        {
          title: "approvedPurchases",
          url: "/purchases/approved-purchases",
        },
        {
          title: "suppliers",
          url: "/purchases/suppliers",
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
        /* {
          title: "logistics",
          url: "/sales/logistics",
        },
        {
          title: "logisticsReport",
          url: "/sales/logistics-reports",
        },
        {
          title: "logisticsTracking",
          url: "/sales/logistics-tracking",
        },
        {
          title: "mutualSettlementVectanIlca",
          url: "/sales/msvil",
        },
        {
          title: "museVectanAndOther",
          url: "/sales/msvo",
        },
        {
          title: "mutualSettlementsIlcaOther",
          url: "/sales/msio",
        },
        {
          title: "clientOrders",
          url: "/sales/client-orders",
        }, */
        {
          title: "productionOrders",
          url: "/sales/production-orders",
        },
      ],
    },
    {
      title: "production",
      icon: Factory,
      items: [
        {
          title: "Сводная таблица заказов ",
          url: "/production/orders",
        },
        {
          title: "Рецепты",
          url: "/production/recipes",
        },
        {
          title: "Процессы",
          url: "/production/processes",
        },
        {
          title: "Лаборатория",
          url: "/production/laboratory",
        },
      ],
    },
    {
      title: "warehouse",
      icon: Package,
      items: [
        {
          title: "Анализ остатков",
          url: "/warehouse/analyze",
        },
        {
          title: "Учет и Приемка основного сырья",
          url: "/warehouse/fabricants",
        },
        {
          title: "Учет и Приемка вспомогательного сырья",
          url: "/warehouse/helper-fabricants",
        },
        {
          title: "Перемещение товаров",
          url: "/warehouse/transfer-items",
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
        {
          title: "buyers",
          url: "/settings/buyers",
        },
        {
          title: "consignees",
          url: "/settings/consignees",
        },
        {
          title: "countries",
          url: "/settings/countries",
        },
        {
          title: "bagTypes",
          url: "/settings/bagTypes",
        },
        {
          title: "marks",
          url: "/settings/marks",
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
