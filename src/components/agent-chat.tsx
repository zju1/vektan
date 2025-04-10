import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Download,
  BarChart3,
  FileText,
  Calendar,
  Package,
  TrendingUp,
  ShoppingCart,
  Factory,
  Loader2,
  RefreshCw,
  Paperclip,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type AgentType =
  | "financial"
  | "inventory"
  | "logistics"
  | "sales"
  | "purchasing"
  | "production";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

interface AgentChatProps {
  agentType: AgentType;
}

export function AgentChat({ agentType }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get agent-specific configuration
  const agentConfig = getAgentConfig(agentType);

  // Add initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        content: agentConfig.welcomeMessage,
        sender: "agent",
        timestamp: new Date(),
      },
    ]);
  }, [agentConfig.welcomeMessage, agentType]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate agent response after a delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: `agent-${Date.now()}`,
        content: getRandomResponse(agentType),
        sender: "agent",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, responseMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: agentConfig.welcomeMessage,
        sender: "agent",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className={`flex items-center gap-4 px-6 py-4 border-b ${agentConfig.headerClass}`}
      >
        <Avatar className="h-10 w-10 border flex items-center justify-center">
          {agentConfig.icon}
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{agentConfig.name}</h1>
            <Badge variant="outline" className="text-xs font-normal">
              Online
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {agentConfig.description}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Clear Chat
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 px-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === "user"
                        ? "bg-brand-main text-white"
                        : "bg-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggested prompts */}
          <div className="px-4 pt-4">
            <div className="flex flex-wrap gap-2">
              {agentConfig.suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 border-t mt-4">
            <div className="flex items-end gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask the ${agentConfig.name} anything...`}
                className="min-h-[60px] flex-1 resize-none"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFileUpload}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" multiple />
          </div>
        </div>

        {/* Right sidebar with actions and info */}
        <div className="w-80 border-l">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {agentConfig.actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t">
            <h3 className="font-bold text-lg mb-3">Recent Reports</h3>
            <Card>
              <CardContent className="p-0">
                {agentConfig.recentReports.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 hover:bg-muted cursor-pointer border-b last:border-0"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.date}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="p-4 border-t">
            <h3 className="font-bold text-lg mb-3">Capabilities</h3>
            <ul className="space-y-2">
              {agentConfig.capabilities.map((capability, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="rounded-full h-1.5 w-1.5 bg-primary mt-2" />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getAgentConfig(agentType: AgentType) {
  const configs = {
    financial: {
      name: "Financial Agent",
      description: "Financial analysis and reporting assistant",
      icon: <BarChart3 className="h-6 w-6 text-emerald-500" />,
      headerClass: "bg-emerald-50",
      welcomeMessage:
        "Hello! I'm your Financial Agent. I can help with financial analysis, reporting, forecasting, and budgeting. How can I assist you today?",
      suggestedPrompts: [
        "Generate Q2 financial report",
        "Analyze cash flow trends",
        "Forecast revenue for next quarter",
        "Compare budget vs. actual expenses",
      ],
      actions: [
        { label: "Generate Report", icon: <FileText className="h-4 w-4" /> },
        {
          label: "Financial Dashboard",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        { label: "Schedule Meeting", icon: <Calendar className="h-4 w-4" /> },
        { label: "Export Data", icon: <Download className="h-4 w-4" /> },
      ],
      recentReports: [
        { title: "Q1 Financial Summary", date: "Apr 15, 2025" },
        { title: "Cash Flow Analysis", date: "Mar 28, 2025" },
        { title: "Budget Variance Report", date: "Mar 10, 2025" },
      ],
      capabilities: [
        "Financial reporting and analysis",
        "Cash flow forecasting",
        "Budget preparation and monitoring",
        "Expense tracking and optimization",
        "Investment analysis",
      ],
    },
    inventory: {
      name: "Inventory Agent",
      description: "Inventory management and optimization assistant",
      icon: <Package className="h-6 w-6 text-blue-500" />,
      headerClass: "bg-blue-50",
      welcomeMessage:
        "Hello! I'm your Inventory Agent. I can help with inventory tracking, stock level optimization, and warehouse management. What would you like to know?",
      suggestedPrompts: [
        "Check current stock levels",
        "Identify low inventory items",
        "Optimize warehouse layout",
        "Generate inventory forecast",
      ],
      actions: [
        { label: "Stock Report", icon: <FileText className="h-4 w-4" /> },
        {
          label: "Inventory Dashboard",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        { label: "Order Supplies", icon: <ShoppingCart className="h-4 w-4" /> },
        { label: "Export Data", icon: <Download className="h-4 w-4" /> },
      ],
      recentReports: [
        { title: "Monthly Inventory Summary", date: "Apr 1, 2025" },
        { title: "Stock Level Analysis", date: "Mar 25, 2025" },
        { title: "Warehouse Efficiency Report", date: "Mar 5, 2025" },
      ],
      capabilities: [
        "Real-time inventory tracking",
        "Stock level optimization",
        "Warehouse management",
        "Demand forecasting",
        "Inventory cost analysis",
      ],
    },
    logistics: {
      name: "Logistics Agent",
      description: "Shipping, routing, and delivery optimization assistant",
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
      headerClass: "bg-purple-50",
      welcomeMessage:
        "Hello! I'm your Logistics Agent. I can help optimize shipping routes, track deliveries, and manage your supply chain. How can I assist you today?",
      suggestedPrompts: [
        "Optimize delivery routes",
        "Track shipment status",
        "Analyze transportation costs",
        "Schedule deliveries for next week",
      ],
      actions: [
        {
          label: "Route Optimization",
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          label: "Logistics Dashboard",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          label: "Schedule Deliveries",
          icon: <Calendar className="h-4 w-4" />,
        },
        { label: "Export Data", icon: <Download className="h-4 w-4" /> },
      ],
      recentReports: [
        { title: "Weekly Delivery Performance", date: "Apr 5, 2025" },
        { title: "Route Efficiency Analysis", date: "Mar 29, 2025" },
        { title: "Transportation Cost Report", date: "Mar 15, 2025" },
      ],
      capabilities: [
        "Route optimization",
        "Delivery tracking and management",
        "Transportation cost analysis",
        "Supply chain optimization",
        "Carrier performance monitoring",
      ],
    },
    sales: {
      name: "Sales Agent",
      description: "Sales analysis, forecasting, and optimization assistant",
      icon: <TrendingUp className="h-6 w-6 text-amber-500" />,
      headerClass: "bg-amber-50",
      welcomeMessage:
        "Hello! I'm your Sales Agent. I can help with sales analysis, forecasting, customer insights, and sales strategy. What would you like to know?",
      suggestedPrompts: [
        "Generate monthly sales forecast",
        "Analyze top-performing products",
        "Identify sales trends by region",
        "Compare sales performance YoY",
      ],
      actions: [
        { label: "Sales Report", icon: <FileText className="h-4 w-4" /> },
        { label: "Sales Dashboard", icon: <BarChart3 className="h-4 w-4" /> },
        { label: "Customer Analysis", icon: <Users className="h-4 w-4" /> },
        { label: "Export Data", icon: <Download className="h-4 w-4" /> },
      ],
      recentReports: [
        { title: "Q1 Sales Performance", date: "Apr 10, 2025" },
        { title: "Regional Sales Analysis", date: "Mar 27, 2025" },
        { title: "Product Performance Report", date: "Mar 12, 2025" },
      ],
      capabilities: [
        "Sales data analysis and reporting",
        "Sales forecasting",
        "Customer segmentation",
        "Product performance analysis",
        "Competitive intelligence",
      ],
    },
    purchasing: {
      name: "Purchasing Agent",
      description: "Procurement and supplier management assistant",
      icon: <ShoppingCart className="h-6 w-6 text-cyan-500" />,
      headerClass: "bg-cyan-50",
      welcomeMessage:
        "Hello! I'm your Purchasing Agent. I can help with procurement, supplier management, purchase orders, and cost optimization. How can I assist you?",
      suggestedPrompts: [
        "Find optimal suppliers",
        "Analyze procurement costs",
        "Generate purchase orders",
        "Evaluate supplier performance",
      ],
      actions: [
        { label: "Procurement Report", icon: <FileText className="h-4 w-4" /> },
        {
          label: "Supplier Dashboard",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          label: "Create Purchase Order",
          icon: <PlusCircle className="h-4 w-4" />,
        },
        { label: "Export Data", icon: <Download className="h-4 w-4" /> },
      ],
      recentReports: [
        { title: "Monthly Procurement Summary", date: "Apr 3, 2025" },
        { title: "Supplier Performance Analysis", date: "Mar 22, 2025" },
        { title: "Cost Savings Report", date: "Mar 8, 2025" },
      ],
      capabilities: [
        "Supplier evaluation and selection",
        "Purchase order management",
        "Cost analysis and optimization",
        "Contract negotiation assistance",
        "Procurement process automation",
      ],
    },
    production: {
      name: "Production Agent",
      description: "Manufacturing and production optimization assistant",
      icon: <Factory className="h-6 w-6 text-rose-500" />,
      headerClass: "bg-rose-50",
      welcomeMessage:
        "Hello! I'm your Production Agent. I can help optimize manufacturing processes, monitor production lines, and improve operational efficiency. What would you like to know?",
      suggestedPrompts: [
        "Optimize production schedule",
        "Analyze manufacturing efficiency",
        "Monitor equipment performance",
        "Identify bottlenecks in production",
      ],
      actions: [
        { label: "Production Report", icon: <FileText className="h-4 w-4" /> },
        {
          label: "Production Dashboard",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          label: "Schedule Maintenance",
          icon: <Calendar className="h-4 w-4" />,
        },
        { label: "Export Data", icon: <Download className="h-4 w-4" /> },
      ],
      recentReports: [
        { title: "Weekly Production Summary", date: "Apr 7, 2025" },
        { title: "Equipment Efficiency Analysis", date: "Mar 31, 2025" },
        { title: "Quality Control Report", date: "Mar 18, 2025" },
      ],
      capabilities: [
        "Production scheduling and optimization",
        "Equipment monitoring and maintenance",
        "Quality control analysis",
        "Process efficiency improvement",
        "Resource allocation optimization",
      ],
    },
  };

  return configs[agentType];
}

// Function to get a random response based on agent type
function getRandomResponse(agentType: AgentType): string {
  const responses = {
    financial: [
      "Based on my analysis of the financial data, I can see that Q2 revenue is up 12% compared to Q1, with particularly strong performance in the North American market. Would you like me to generate a detailed report?",
      "I've analyzed your cash flow trends over the past 6 months. There's a consistent pattern of increased expenses at the end of each quarter. This might be related to your quarterly tax payments. Would you like me to investigate further?",
      "Looking at your current budget vs. actual expenses, you're currently 7% under budget for marketing but 5% over budget for operations. This suggests an opportunity to reallocate some resources. Would you like recommendations on how to optimize this?",
      "I've forecasted your revenue for the next quarter based on historical data and current market trends. We're projecting a 15-18% growth, primarily driven by your new product line. Would you like to see the detailed forecast?",
    ],
    inventory: [
      "I've analyzed your current inventory levels. You have 15 SKUs that are below the reorder threshold, primarily in the electronics category. Would you like me to generate a purchase order for these items?",
      "Based on your sales velocity and current stock levels, I predict you'll need to restock these 5 high-demand items within the next 7 days to avoid stockouts. Would you like me to prioritize these for immediate ordering?",
      "I've optimized your warehouse layout based on picking frequency and item relationships. This new arrangement could reduce picking time by approximately 23%. Would you like to see the proposed layout?",
      "Your seasonal inventory forecast is ready. Based on last year's data and current trends, you should increase stock of outdoor products by 30% for the upcoming summer season. Would you like the detailed forecast report?",
    ],
    logistics: [
      "I've optimized your delivery routes for next week. The new routing plan reduces total distance by 18% and estimated fuel costs by 22%. Would you like me to implement this plan?",
      "Shipment #45982 is currently in transit and is expected to arrive at the destination tomorrow at approximately 2:30 PM. It's currently at the Chicago distribution center. Would you like me to send you real-time updates?",
      "I've analyzed your transportation costs for Q1. LTL shipments have increased by 15% in cost, while FTL costs have remained stable. This suggests we should consolidate more shipments. Would you like a detailed cost breakdown?",
      "Your delivery schedule for next week has been optimized. We've consolidated 12 shipments into 8, which should reduce transportation costs by approximately $3,200. Would you like to review and approve this schedule?",
    ],
    sales: [
      "Based on historical data and current trends, I forecast total sales of $2.4M for next month, representing a 12% increase year-over-year. The growth is primarily driven by the western region. Would you like to see the detailed forecast?",
      "I've analyzed your product performance. Your top 3 products by revenue are Product A ($450K), Product B ($320K), and Product C ($275K). However, Product D has the highest profit margin at 68%. Would you like a complete product performance report?",
      "Looking at regional sales trends, the Northeast has shown consistent growth of 15% YoY, while the Southwest has slowed to 5% growth. This might be related to the new competitor in the Southwest market. Would you like me to analyze this further?",
      "Comparing your YoY sales performance, overall revenue is up 18%, with particularly strong performance in the enterprise segment (up 27%). However, SMB sales have only increased by 8%. Would you like recommendations to boost SMB performance?",
    ],
    purchasing: [
      "I've identified 3 potential new suppliers for your raw materials that could reduce costs by 12-15% while maintaining quality standards. Would you like me to prepare a detailed comparison report?",
      "After analyzing your procurement costs for Q1, I've found that shipping costs have increased by 22% due to fuel surcharges. I recommend negotiating volume discounts with your primary carrier. Would you like me to draft a proposal?",
      "I've prepared 5 purchase orders for your approval based on current inventory levels and production requirements. The total value is $78,450. Would you like to review and approve these orders?",
      "Based on my evaluation of supplier performance, Supplier A has maintained 98% on-time delivery and 99.5% quality compliance, while Supplier B has dropped to 87% on-time delivery. Would you like a complete supplier performance report?",
    ],
    production: [
      "I've optimized your production schedule for next week. By resequencing jobs on Line 2, we can increase throughput by approximately 15% without additional resources. Would you like to implement this schedule?",
      "After analyzing manufacturing efficiency, I've identified that Machine #7 is operating at 72% efficiency compared to the 85% average. This may indicate maintenance is required. Would you like me to schedule a maintenance check?",
      "Equipment performance monitoring shows that the packaging line is experiencing 12% more downtime than last month. The root cause appears to be calibration issues. Would you like me to create a maintenance ticket?",
      "I've identified a bottleneck in your production process at the assembly stage. This is causing a 25% reduction in overall throughput. By adding one additional worker to this station, we could increase production by 20%. Would you like a detailed analysis?",
    ],
  };

  const agentResponses = responses[agentType];
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
}

// Missing component definitions
function Users(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PlusCircle(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
