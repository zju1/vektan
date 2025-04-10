import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  DollarSign,
  Factory,
  Package,
  Truck,
  Shield,
  Settings,
  Container,
  Bot,
  Book,
  Cog,
  ChartArea,
} from "lucide-react";

export const navigationData = {
  navMain: [
    {
      title: "dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "clients",
      url: "/clients",
      icon: Users,
    },
    {
      title: "purchase",
      icon: ShoppingCart,
      url: "/purchases",
    },
    {
      title: "sale",
      icon: DollarSign,
      url: "/sales",
    },
    {
      title: "production",
      icon: Factory,
      items: [
        {
          title: "productionPlanning",
          url: "/production/production-planning",
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
      ],
    },
    {
      title: "suppliers",
      url: "/suppliers",
      icon: Container,
    },
    {
      title: "logistics",
      url: "/logistics",
      icon: Truck,
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
