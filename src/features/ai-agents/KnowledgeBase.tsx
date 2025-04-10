import { useState } from "react";
import {
  Search,
  Filter,
  Book,
  FileText,
  ChevronRight,
  Clock,
  Users,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter articles based on search query and selected category
  const filteredArticles = knowledgeArticles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null ||
      article.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <Button>Create Article</Button>
          </div>
          <p className="text-muted-foreground">
            Search for articles, guides, and documentation for your AI agents
          </p>
          <div className="flex w-full items-center gap-2 pb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search knowledge base..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Categories */}
        <div className="w-64 border-r py-4 pr-4 hidden md:block">
          <h2 className="font-bold text-lg mb-3">Categories</h2>
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.icon}
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Button>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-bold text-lg mb-3">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <div className="p-4 border-b">
              <TabsList>
                <TabsTrigger value="all">All Articles</TabsTrigger>
                <TabsTrigger value="guides">Guides</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-0 md:p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                      <Book className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium">No articles found</h3>
                      <p className="text-muted-foreground mt-2">
                        Try adjusting your search or filter to find what you're
                        looking for
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="guides" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles
                    .filter((article) => article.type === "guide")
                    .map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="documentation"
              className="flex-1 overflow-hidden"
            >
              <ScrollArea className="h-full">
                <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles
                    .filter((article) => article.type === "documentation")
                    .map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="tutorials" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles
                    .filter((article) => article.type === "tutorial")
                    .map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface Article {
  id: string;
  title: string;
  description: string;
  type: "guide" | "documentation" | "tutorial";
  categories: string[];
  tags: string[];
  author: string;
  updatedAt: string;
  readTime: number;
}

interface ArticleCardProps {
  article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{article.title}</CardTitle>
          <Badge variant={getBadgeVariant(article.type)}>{article.type}</Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {article.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {article.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{article.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{article.readTime} min read</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{article.author}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
          Read
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function getBadgeVariant(type: string) {
  switch (type) {
    case "guide":
      return "default";
    case "documentation":
      return "secondary";
    case "tutorial":
      return "outline";
    default:
      return "default";
  }
}

// Sample data
const categories = [
  {
    id: "financial",
    name: "Financial",
    icon: <BarChart className="h-4 w-4" />,
  },
  { id: "inventory", name: "Inventory", icon: <Package className="h-4 w-4" /> },
  { id: "logistics", name: "Logistics", icon: <Truck className="h-4 w-4" /> },
  { id: "sales", name: "Sales", icon: <TrendingUp className="h-4 w-4" /> },
  {
    id: "purchasing",
    name: "Purchasing",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    id: "production",
    name: "Production",
    icon: <Factory className="h-4 w-4" />,
  },
  { id: "general", name: "General", icon: <FileText className="h-4 w-4" /> },
];

const popularTags = [
  "Reports",
  "Analytics",
  "Forecasting",
  "Integration",
  "Automation",
  "Best Practices",
  "Troubleshooting",
];

const knowledgeArticles: Article[] = [
  {
    id: "1",
    title: "Getting Started with the Financial Agent",
    description:
      "Learn how to use the Financial Agent to generate reports, analyze financial data, and create forecasts for your business.",
    type: "guide",
    categories: ["financial", "general"],
    tags: ["Financial", "Reports", "Getting Started"],
    author: "Finance Team",
    updatedAt: "2025-04-01",
    readTime: 5,
  },
  {
    id: "2",
    title: "Advanced Financial Forecasting Techniques",
    description:
      "Discover advanced techniques for financial forecasting using historical data, market trends, and AI-powered predictions.",
    type: "tutorial",
    categories: ["financial"],
    tags: ["Financial", "Forecasting", "Advanced"],
    author: "Finance Team",
    updatedAt: "2025-03-28",
    readTime: 12,
  },
  {
    id: "3",
    title: "Inventory Management Best Practices",
    description:
      "Learn the best practices for managing inventory levels, optimizing stock, and reducing carrying costs.",
    type: "guide",
    categories: ["inventory"],
    tags: ["Inventory", "Best Practices", "Optimization"],
    author: "Inventory Team",
    updatedAt: "2025-03-25",
    readTime: 8,
  },
  {
    id: "4",
    title: "Inventory Agent API Documentation",
    description:
      "Complete API documentation for the Inventory Agent, including endpoints, parameters, and response formats.",
    type: "documentation",
    categories: ["inventory", "general"],
    tags: ["Inventory", "API", "Integration", "Technical"],
    author: "Dev Team",
    updatedAt: "2025-03-22",
    readTime: 15,
  },
  {
    id: "5",
    title: "Optimizing Logistics Routes",
    description:
      "Step-by-step guide to optimizing delivery routes, reducing transportation costs, and improving delivery times.",
    type: "tutorial",
    categories: ["logistics"],
    tags: ["Logistics", "Optimization", "Routes", "Cost Saving"],
    author: "Logistics Team",
    updatedAt: "2025-03-20",
    readTime: 10,
  },
  {
    id: "6",
    title: "Sales Forecasting Methodology",
    description:
      "Detailed explanation of the sales forecasting methodology used by the Sales Agent, including algorithms and data sources.",
    type: "documentation",
    categories: ["sales"],
    tags: ["Sales", "Forecasting", "Methodology", "Technical"],
    author: "Sales Team",
    updatedAt: "2025-03-18",
    readTime: 12,
  },
  {
    id: "7",
    title: "Supplier Evaluation Framework",
    description:
      "Learn how to evaluate and select suppliers using the Purchasing Agent's evaluation framework and scoring system.",
    type: "guide",
    categories: ["purchasing"],
    tags: ["Purchasing", "Suppliers", "Evaluation", "Best Practices"],
    author: "Procurement Team",
    updatedAt: "2025-03-15",
    readTime: 7,
  },
  {
    id: "8",
    title: "Production Line Efficiency Analysis",
    description:
      "Tutorial on analyzing production line efficiency, identifying bottlenecks, and implementing improvements.",
    type: "tutorial",
    categories: ["production"],
    tags: ["Production", "Efficiency", "Analysis", "Optimization"],
    author: "Production Team",
    updatedAt: "2025-03-12",
    readTime: 9,
  },
  {
    id: "9",
    title: "Integrating AI Agents with External Systems",
    description:
      "Technical guide for integrating AI agents with external systems like ERP, CRM, and accounting software.",
    type: "documentation",
    categories: ["general"],
    tags: ["Integration", "Technical", "API", "External Systems"],
    author: "Dev Team",
    updatedAt: "2025-03-10",
    readTime: 18,
  },
  {
    id: "10",
    title: "Creating Custom Reports with the Financial Agent",
    description:
      "Learn how to create custom financial reports using templates, filters, and visualization options.",
    type: "tutorial",
    categories: ["financial"],
    tags: ["Financial", "Reports", "Customization"],
    author: "Finance Team",
    updatedAt: "2025-03-08",
    readTime: 6,
  },
  {
    id: "11",
    title: "Inventory Forecasting Models",
    description:
      "Detailed explanation of inventory forecasting models, including seasonal adjustments and demand patterns.",
    type: "documentation",
    categories: ["inventory"],
    tags: ["Inventory", "Forecasting", "Models", "Technical"],
    author: "Inventory Team",
    updatedAt: "2025-03-05",
    readTime: 14,
  },
  {
    id: "12",
    title: "Logistics Performance Metrics",
    description:
      "Guide to understanding and using logistics performance metrics to measure and improve delivery operations.",
    type: "guide",
    categories: ["logistics"],
    tags: ["Logistics", "Metrics", "Performance", "Analytics"],
    author: "Logistics Team",
    updatedAt: "2025-03-02",
    readTime: 8,
  },
  {
    id: "13",
    title: "Sales Territory Planning",
    description:
      "Learn how to use the Sales Agent to plan and optimize sales territories based on potential and performance.",
    type: "tutorial",
    categories: ["sales"],
    tags: ["Sales", "Territory", "Planning", "Optimization"],
    author: "Sales Team",
    updatedAt: "2025-02-28",
    readTime: 11,
  },
  {
    id: "14",
    title: "Purchase Order Automation",
    description:
      "Step-by-step guide to automating the purchase order process using the Purchasing Agent.",
    type: "guide",
    categories: ["purchasing"],
    tags: ["Purchasing", "Automation", "Purchase Orders", "Workflow"],
    author: "Procurement Team",
    updatedAt: "2025-02-25",
    readTime: 7,
  },
  {
    id: "15",
    title: "Production Scheduling Algorithms",
    description:
      "Technical documentation of the algorithms used for production scheduling and optimization.",
    type: "documentation",
    categories: ["production"],
    tags: ["Production", "Scheduling", "Algorithms", "Technical"],
    author: "Production Team",
    updatedAt: "2025-02-22",
    readTime: 16,
  },
];

// Missing component definitions
function BarChart(props: any) {
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
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function Truck(props: any) {
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
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
      <path d="M14 17h1" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function TrendingUp(props: any) {
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function ShoppingCart(props: any) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function Factory(props: any) {
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
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
    </svg>
  );
}

function Package(props: any) {
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
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
