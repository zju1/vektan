import { useState } from "react";
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  Settings,
  Clock,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

export function DashboardPage() {
  const [_timeframe, setTimeframe] = useState("week");
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
        <h1 className="font-sans font-bold text-2xl">{t("dashboard")}</h1>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* AI Business Summary */}
      <Card className="border-l-4 bg-gradient-to-b from-brand-50/30 to-brand-50 border-l-brand-main shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-brand-main" />
            AI Business Summary
          </CardTitle>
          <CardDescription>
            Insights based on your business data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="day"
            className="w-full"
            onValueChange={setTimeframe}
          >
            <TabsList className="grid w-full grid-cols-4 bg-gray-200">
              <TabsTrigger value="day">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
            <TabsContent value="day" className="mt-4 space-y-4">
              <p className="text-sm">
                <strong>Today's Performance:</strong> Sales are up 12% compared
                to yesterday with 28 new orders. Production is on track with 92%
                of daily targets met. Inventory levels for raw materials are at
                78% capacity. Three new clients were added today. There are 2
                pending supplier deliveries expected by end of day.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className=" border-none bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                  Sales +12%
                </Badge>
                <Badge variant="outline" className=" border-none bg-blue-50">
                  <Users className="mr-1 h-3 w-3 text-blue-600" />3 New Clients
                </Badge>
                <Badge variant="outline" className=" border-none bg-yellow-50">
                  <AlertTriangle className="mr-1 h-3 w-3 text-yellow-600" />
                  Low Stock: 2 Items
                </Badge>
              </div>
            </TabsContent>
            <TabsContent value="week" className="mt-4 space-y-4">
              <p className="text-sm">
                <strong>Weekly Performance:</strong> Overall sales have
                increased by 8% compared to last week. Production efficiency has
                improved by 5% with reduced defect rates. Warehouse capacity
                utilization is at 65%. Client acquisition rate is up 15% with 12
                new clients this week. Supplier delivery reliability is at 94%.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className=" border-none bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                  Sales +8%
                </Badge>
                <Badge variant="outline" className=" border-none bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                  Production +5%
                </Badge>
                <Badge variant="outline" className=" border-none bg-blue-50">
                  <Users className="mr-1 h-3 w-3 text-blue-600" />
                  12 New Clients
                </Badge>
              </div>
            </TabsContent>
            <TabsContent value="month" className="mt-4 space-y-4">
              <p className="text-sm">
                <strong>Monthly Performance:</strong> Monthly revenue is 15%
                above target with strong performance in finished products.
                Production costs have decreased by 3% due to improved
                efficiency. Inventory turnover has increased by 7%. Client
                retention rate is at 92%. There's a 10% increase in supplier
                diversity.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className=" border-none bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                  Revenue +15%
                </Badge>
                <Badge variant="outline" className=" border-none bg-green-50">
                  <ArrowDownRight className="mr-1 h-3 w-3 text-green-600" />
                  Costs -3%
                </Badge>
                <Badge variant="outline" className=" border-none bg-blue-50">
                  <Package className="mr-1 h-3 w-3 text-blue-600" />
                  Inventory +7%
                </Badge>
              </div>
            </TabsContent>
            <TabsContent value="year" className="mt-4 space-y-4">
              <p className="text-sm">
                <strong>Yearly Performance:</strong> Annual growth is at 22%
                compared to previous year. Production capacity has expanded by
                30%. Total client base has grown by 45%. Warehouse efficiency
                has improved by 18%. Supplier relationships have been
                strengthened with 15 new strategic partnerships.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className=" border-none bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                  Growth +22%
                </Badge>
                <Badge variant="outline" className=" border-none bg-green-50">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                  Production +30%
                </Badge>
                <Badge variant="outline" className=" border-none bg-blue-50">
                  <Users className="mr-1 h-3 w-3 text-blue-600" />
                  Clients +45%
                </Badge>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
            <Progress className="mt-4" value={75} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              +180 new clients this month
            </p>
            <Progress className="mt-4" value={62} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Status
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              Warehouse capacity utilization
            </p>
            <Progress className="mt-4" value={82} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Production Rate
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +4.1% from last week
            </p>
            <Progress className="mt-4" value={94} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="purchases" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="production" stroke="#ffc658" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest purchase orders received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div
                    className="rounded-full p-2"
                    style={{ backgroundColor: order.color }}
                  >
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.client}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Order #{order.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${order.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </CardFooter>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Production Alerts</CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productionAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-2 ${
                      alert.level === "high"
                        ? "bg-red-500"
                        : alert.level === "medium"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      alert.level === "high"
                        ? "destructive"
                        : alert.level === "medium"
                        ? "default"
                        : "outline"
                    }
                  >
                    {alert.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Alerts
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Supplier and Inventory Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Supplier Status</CardTitle>
            <CardDescription>Recent supplier activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplierStatus.map((supplier) => (
                <div key={supplier.id} className="flex items-center gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={supplier.avatar} alt={supplier.name} />
                    <AvatarFallback>
                      {supplier.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {supplier.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {supplier.status}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.deliveryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Suppliers
            </Button>
          </CardFooter>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
            <CardDescription>Inventory items requiring reorder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="rounded-full p-2 bg-amber-100">
                    <Package className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.quantity} units</p>
                    <p className="text-xs text-muted-foreground">
                      Min: {item.minimum}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Inventory
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Production Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Production Overview</CardTitle>
          <CardDescription>
            Current production status across departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productionStatus.map((dept) => (
              <div key={dept.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {dept.department}
                    </span>
                  </div>
                  <span className="text-sm">{dept.completion}% Complete</span>
                </div>
                <Progress value={dept.completion} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: {dept.target} units</span>
                  <span>Produced: {dept.produced} units</span>
                  <span>Defects: {dept.defects}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View Production Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Sample data
const recentOrders = [
  {
    id: "ORD-7892",
    client: "Acme Corporation",
    amount: "1,240.00",
    date: "Just now",
    color: "#4f46e5",
  },
  {
    id: "ORD-7891",
    client: "Global Industries",
    amount: "3,530.00",
    date: "2 hours ago",
    color: "#0891b2",
  },
  {
    id: "ORD-7890",
    client: "Tech Solutions Inc.",
    amount: "890.50",
    date: "5 hours ago",
    color: "#059669",
  },
  {
    id: "ORD-7889",
    client: "Innovative Systems",
    amount: "2,470.00",
    date: "Yesterday",
    color: "#d946ef",
  },
];

const productionAlerts = [
  {
    id: 1,
    title: "Equipment Malfunction",
    description: "CNC Machine #3 requires maintenance",
    level: "high",
  },
  {
    id: 2,
    title: "Quality Control Issue",
    description: "Batch #45892 failed quality check",
    level: "medium",
  },
  {
    id: 3,
    title: "Production Delay",
    description: "Line B running at 75% capacity",
    level: "medium",
  },
  {
    id: 4,
    title: "Material Shortage",
    description: "Aluminum sheets running low",
    level: "low",
  },
];

const supplierStatus = [
  {
    id: 1,
    name: "MetalWorks Inc.",
    status: "Shipment in transit",
    deliveryDate: "Today",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "ElectroParts Co.",
    status: "Order confirmed",
    deliveryDate: "Mar 15",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "ChemSupply Ltd.",
    status: "Payment pending",
    deliveryDate: "Mar 18",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "FastLogistics",
    status: "Delivered",
    deliveryDate: "Mar 10",
    avatar: "/placeholder.svg",
  },
];

const lowStockItems = [
  {
    id: 1,
    name: "Aluminum Sheet 2mm",
    category: "Raw Material",
    quantity: 120,
    minimum: 200,
  },
  {
    id: 2,
    name: "Circuit Board A-103",
    category: "Components",
    quantity: 45,
    minimum: 100,
  },
  {
    id: 3,
    name: "Hydraulic Valve HV-28",
    category: "Equipment Parts",
    quantity: 15,
    minimum: 30,
  },
  {
    id: 4,
    name: "Protective Coating PC-9",
    category: "Materials",
    quantity: 5,
    minimum: 20,
  },
];

const productionStatus = [
  {
    id: 1,
    department: "Assembly Line A",
    completion: 85,
    target: 500,
    produced: 425,
    defects: 2.1,
  },
  {
    id: 2,
    department: "Fabrication",
    completion: 72,
    target: 300,
    produced: 216,
    defects: 3.5,
  },
  {
    id: 3,
    department: "Quality Control",
    completion: 94,
    target: 425,
    produced: 400,
    defects: 1.2,
  },
  {
    id: 4,
    department: "Packaging",
    completion: 68,
    target: 450,
    produced: 306,
    defects: 0.8,
  },
];

// Sample data for charts
const salesData = [
  { name: "Jan", sales: 4000, purchases: 2400, production: 2400 },
  { name: "Feb", sales: 3000, purchases: 1398, production: 2210 },
  { name: "Mar", sales: 2000, purchases: 9800, production: 2290 },
  { name: "Apr", sales: 2780, purchases: 3908, production: 2000 },
  { name: "May", sales: 1890, purchases: 4800, production: 2181 },
  { name: "Jun", sales: 2390, purchases: 3800, production: 2500 },
  { name: "Jul", sales: 3490, purchases: 4300, production: 2100 },
  { name: "Aug", sales: 4000, purchases: 2400, production: 2400 },
  { name: "Sep", sales: 3000, purchases: 1398, production: 2210 },
  { name: "Oct", sales: 2000, purchases: 9800, production: 2290 },
  { name: "Nov", sales: 2780, purchases: 3908, production: 2000 },
  { name: "Dec", sales: 1890, purchases: 4800, production: 2181 },
];

const revenueData = [
  { name: "Finished Products", value: 45 },
  { name: "Services", value: 25 },
  { name: "Raw Materials", value: 20 },
  { name: "Equipment", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
