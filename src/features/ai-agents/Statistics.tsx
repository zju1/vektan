import { useState } from "react";
import {
  BarChart,
  LineChart,
  Activity,
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDown,
  Clock,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AIStatisticsPage() {
  const [dateRange, setDateRange] = useState<string>("7d");

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Executive AI Agents Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor AI agents performance and reports for executive
            decision-making
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Calendar className="h-4 w-4" />
                {dateRange === "7d" && "Last 7 days"}
                {dateRange === "30d" && "Last 30 days"}
                {dateRange === "90d" && "Last 90 days"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDateRange("7d")}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("30d")}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("90d")}>
                Last 90 days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>Download Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-4">
        <TabsList className="bg-gray-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Interactions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,685</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" /> +12.5%
                  </span>{" "}
                  from previous period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Response Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center gap-1">
                    <ArrowDown className="h-3 w-3" /> -0.3s
                  </span>{" "}
                  from previous period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" /> +1.2%
                  </span>{" "}
                  from previous period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Token Usage
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.4M</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-rose-500 flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" /> +18.7%
                  </span>{" "}
                  from previous period
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interactions Over Time</CardTitle>
                <CardDescription>
                  Daily interactions with AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <LineChartPlaceholder />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Distribution</CardTitle>
                <CardDescription>Interactions by agent type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <BarChartPlaceholder />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Top Performing Agents</CardTitle>
                <CardDescription>
                  Agents with highest success rates and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center">
                      <div className="w-[46px] h-[46px] rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        {agent.icon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {agent.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {agent.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {agent.successRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {agent.interactions} interactions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest agent interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-2 h-2 mt-1 rounded-full bg-primary" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>
                  Average response time by model
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <BarChartPlaceholder />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rates</CardTitle>
                <CardDescription>Percentage of failed requests</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <LineChartPlaceholder />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latency Distribution</CardTitle>
                <CardDescription>Response time percentiles</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <BarChartPlaceholder />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Token Consumption</CardTitle>
                <CardDescription>Daily token usage by model</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <LineChartPlaceholder />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Estimated costs by agent type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <BarChartPlaceholder />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>Monthly usage patterns</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <LineChartPlaceholder />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 mt-4">
            {agentCards.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                      {agent.name}
                    </CardTitle>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        agent.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {agent.status}
                    </div>
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Success Rate
                      </span>
                      <span className="font-medium">{agent.successRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Avg. Response
                      </span>
                      <span className="font-medium">{agent.avgResponse}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Calls
                      </span>
                      <span className="font-medium">
                        {agent.totalCalls.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${agent.usage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Usage: {agent.usage}%</span>
                      <span>{agent.lastUsed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Placeholder components for charts
function LineChartPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center text-muted-foreground">
      <LineChart className="h-16 w-16" />
      <p className="text-sm">Line Chart Visualization</p>
    </div>
  );
}

function BarChartPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center text-muted-foreground">
      <BarChart className="h-16 w-16" />
      <p className="text-sm">Bar Chart Visualization</p>
    </div>
  );
}

// Sample data
const topAgents = [
  {
    id: 1,
    name: "Financial Agent",
    type: "Finance",
    successRate: 99.2,
    interactions: 8432,
    icon: <Activity className="h-5 w-5 text-primary" />,
  },
  {
    id: 2,
    name: "Sales Agent",
    type: "Sales",
    successRate: 97.8,
    interactions: 5621,
    icon: <Users className="h-5 w-5 text-primary" />,
  },
  {
    id: 3,
    name: "Inventory Agent",
    type: "Inventory",
    successRate: 96.5,
    interactions: 4217,
    icon: <Zap className="h-5 w-5 text-primary" />,
  },
  {
    id: 4,
    name: "Logistics Agent",
    type: "Logistics",
    successRate: 95.9,
    interactions: 3854,
    icon: <Calendar className="h-5 w-5 text-primary" />,
  },
];

const recentActivity = [
  {
    id: 1,
    action: "Financial Agent generated Q2 financial report",
    time: "2 minutes ago",
  },
  {
    id: 2,
    action: "Sales Agent completed monthly sales forecast",
    time: "15 minutes ago",
  },
  {
    id: 3,
    action: "Inventory Agent updated stock levels across 5 warehouses",
    time: "42 minutes ago",
  },
  {
    id: 4,
    action: "Logistics Agent optimized delivery routes for next week",
    time: "1 hour ago",
  },
  {
    id: 5,
    action: "Purchasing Agent negotiated new supplier contract",
    time: "2 hours ago",
  },
];

const agentCards = [
  {
    id: 1,
    name: "Financial Agent",
    status: "Active",
    description: "Generates financial reports and forecasts",
    successRate: 99.2,
    avgResponse: 1.1,
    totalCalls: 24685,
    usage: 78,
    lastUsed: "Just now",
  },
  {
    id: 2,
    name: "Inventory Agent",
    status: "Active",
    description: "Monitors and manages inventory levels across warehouses",
    successRate: 97.8,
    avgResponse: 2.3,
    totalCalls: 18432,
    usage: 65,
    lastUsed: "5 min ago",
  },
  {
    id: 3,
    name: "Logistics Agent",
    status: "Active",
    description: "Optimizes shipping routes and delivery schedules",
    successRate: 96.5,
    avgResponse: 3.2,
    totalCalls: 15789,
    usage: 82,
    lastUsed: "12 min ago",
  },
  {
    id: 4,
    name: "Sales Agent",
    status: "Active",
    description: "Analyzes sales data and generates forecasts",
    successRate: 95.9,
    avgResponse: 0.8,
    totalCalls: 12543,
    usage: 45,
    lastUsed: "30 min ago",
  },
  {
    id: 5,
    name: "Purchasing Agent",
    status: "Active",
    description: "Manages procurement and supplier relationships",
    successRate: 94.7,
    avgResponse: 1.5,
    totalCalls: 9876,
    usage: 32,
    lastUsed: "2 hours ago",
  },
  {
    id: 6,
    name: "Production Agent",
    status: "Active",
    description: "Monitors production lines and optimizes workflows",
    successRate: 93.2,
    avgResponse: 2.7,
    totalCalls: 8765,
    usage: 58,
    lastUsed: "1 hour ago",
  },
];
