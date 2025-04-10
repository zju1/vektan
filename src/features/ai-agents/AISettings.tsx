import { useState } from "react";
import {
  Save,
  RotateCcw,
  BarChart3,
  Package,
  TrendingUp,
  Database,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function AISettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleResetSettings = () => {
    // Simulate reset
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">AI Settings</h1>
            <p className="text-muted-foreground">
              Configure your AI agents and model settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleResetSettings}
              disabled={isLoading}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="general" className="h-full flex flex-col">
          <div className="py-2 border-b">
            <TabsList className="grid w-full mx-auto max-w-5xl bg-gray-200 grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <div className="max-w-5xl mx-auto py-4">
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Global AI Settings</CardTitle>
                    <CardDescription>
                      Configure global settings for all AI agents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="ai-enabled" className="font-medium">
                            Enable AI Agents
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Turn all AI agents on or off globally
                          </p>
                        </div>
                        <Switch id="ai-enabled" defaultChecked />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="logging" className="font-medium">
                            Conversation Logging
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Store conversation history for training and
                            improvement
                          </p>
                        </div>
                        <Switch id="logging" defaultChecked />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label
                          htmlFor="default-language"
                          className="font-medium"
                        >
                          Default Language
                        </Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="default-language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Set the default language for all AI agents
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="response-tone" className="font-medium">
                          Response Tone
                        </Label>
                        <Select defaultValue="professional">
                          <SelectTrigger id="response-tone">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">
                              Professional
                            </SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="simple">Simple</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Set the tone of voice for AI responses
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Usage Limits</CardTitle>
                    <CardDescription>
                      Configure usage limits and quotas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="token-limit" className="font-medium">
                            Monthly Token Limit
                          </Label>
                          <span className="text-sm font-medium">
                            10M tokens
                          </span>
                        </div>
                        <Slider
                          id="token-limit"
                          defaultValue={[10]}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1M</span>
                          <span>25M</span>
                          <span>50M</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="concurrent-requests"
                            className="font-medium"
                          >
                            Max Concurrent Requests
                          </Label>
                          <span className="text-sm font-medium">
                            25 requests
                          </span>
                        </div>
                        <Slider
                          id="concurrent-requests"
                          defaultValue={[25]}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>5</span>
                          <span>50</span>
                          <span>100</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label
                            htmlFor="rate-limiting"
                            className="font-medium"
                          >
                            Rate Limiting
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically limit excessive requests
                          </p>
                        </div>
                        <Switch id="rate-limiting" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Configure AI-related notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="usage-alerts" className="font-medium">
                          Usage Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts when approaching usage limits
                        </p>
                      </div>
                      <Switch id="usage-alerts" defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="error-notifications"
                          className="font-medium"
                        >
                          Error Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts for critical AI errors
                        </p>
                      </div>
                      <Switch id="error-notifications" defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="performance-reports"
                          className="font-medium"
                        >
                          Weekly Performance Reports
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly AI performance summaries
                        </p>
                      </div>
                      <Switch id="performance-reports" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Configuration</CardTitle>
                    <CardDescription>
                      Configure individual AI agents
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Agent Interactions</CardTitle>
                    <CardDescription>
                      Configure how agents interact with each other
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="agent-collaboration"
                          className="font-medium"
                        >
                          Agent Collaboration
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow agents to collaborate on complex tasks
                        </p>
                      </div>
                      <Switch id="agent-collaboration" defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="knowledge-sharing"
                          className="font-medium"
                        >
                          Knowledge Sharing
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow agents to share knowledge and insights
                        </p>
                      </div>
                      <Switch id="knowledge-sharing" defaultChecked />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label
                        htmlFor="orchestration-model"
                        className="font-medium"
                      >
                        Orchestration Model
                      </Label>
                      <Select defaultValue="hierarchical">
                        <SelectTrigger id="orchestration-model">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hierarchical">
                            Hierarchical
                          </SelectItem>
                          <SelectItem value="peer-to-peer">
                            Peer-to-Peer
                          </SelectItem>
                          <SelectItem value="centralized">
                            Centralized
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Define how agents coordinate with each other
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="models" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Configuration</CardTitle>
                    <CardDescription>
                      Configure AI model settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="default-model" className="font-medium">
                          Default Model
                        </Label>
                        <Select defaultValue="gpt-4o">
                          <SelectTrigger id="default-model">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">
                              GPT-3.5 Turbo
                            </SelectItem>
                            <SelectItem value="claude-3-opus">
                              Claude 3 Opus
                            </SelectItem>
                            <SelectItem value="claude-3-sonnet">
                              Claude 3 Sonnet
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Set the default model for all agents
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="temperature" className="font-medium">
                            Temperature
                          </Label>
                          <span className="text-sm font-medium">0.7</span>
                        </div>
                        <Slider
                          id="temperature"
                          defaultValue={[0.7]}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0 (Deterministic)</span>
                          <span>1 (Creative)</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Control the randomness of the model's responses
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="max-tokens" className="font-medium">
                            Max Tokens
                          </Label>
                          <span className="text-sm font-medium">
                            4,000 tokens
                          </span>
                        </div>
                        <Slider
                          id="max-tokens"
                          defaultValue={[4000]}
                          max={8000}
                          step={1000}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1,000</span>
                          <span>4,000</span>
                          <span>8,000</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Set the maximum length of model responses
                        </p>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="streaming" className="font-medium">
                            Response Streaming
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Stream responses in real-time as they're generated
                          </p>
                        </div>
                        <Switch id="streaming" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Model Settings</CardTitle>
                    <CardDescription>
                      Configure advanced AI model parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="top-p" className="font-medium">
                          Top P
                        </Label>
                        <span className="text-sm font-medium">0.9</span>
                      </div>
                      <Slider
                        id="top-p"
                        defaultValue={[0.9]}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Control diversity via nucleus sampling
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="frequency-penalty"
                          className="font-medium"
                        >
                          Frequency Penalty
                        </Label>
                        <span className="text-sm font-medium">0.5</span>
                      </div>
                      <Slider
                        id="frequency-penalty"
                        defaultValue={[0.5]}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Reduce repetition of frequent tokens
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="presence-penalty"
                          className="font-medium"
                        >
                          Presence Penalty
                        </Label>
                        <span className="text-sm font-medium">0.5</span>
                      </div>
                      <Slider
                        id="presence-penalty"
                        defaultValue={[0.5]}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground">
                        Reduce repetition of any token that has appeared
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Model Fallbacks</CardTitle>
                    <CardDescription>
                      Configure model fallback behavior
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="enable-fallbacks"
                          className="font-medium"
                        >
                          Enable Fallbacks
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically switch to backup models when primary
                          fails
                        </p>
                      </div>
                      <Switch id="enable-fallbacks" defaultChecked />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="fallback-model" className="font-medium">
                        Fallback Model
                      </Label>
                      <Select defaultValue="gpt-3.5-turbo">
                        <SelectTrigger id="fallback-model">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-3.5-turbo">
                            GPT-3.5 Turbo
                          </SelectItem>
                          <SelectItem value="claude-3-haiku">
                            Claude 3 Haiku
                          </SelectItem>
                          <SelectItem value="mistral-medium">
                            Mistral Medium
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Model to use when primary model fails
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="retry-attempts" className="font-medium">
                        Retry Attempts
                      </Label>
                      <Select defaultValue="3">
                        <SelectTrigger id="retry-attempts">
                          <SelectValue placeholder="Select attempts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 attempt</SelectItem>
                          <SelectItem value="2">2 attempts</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Number of retry attempts before fallback
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Sources</CardTitle>
                    <CardDescription>
                      Configure data sources for AI agents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-medium">ERP System</h3>
                          <p className="text-sm text-muted-foreground">
                            Connected to SAP ERP
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-emerald-500 border-emerald-200 bg-emerald-50"
                      >
                        Connected
                      </Badge>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="h-8 w-8 text-purple-500" />
                        <div>
                          <h3 className="font-medium">CRM System</h3>
                          <p className="text-sm text-muted-foreground">
                            Connected to Salesforce
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-emerald-500 border-emerald-200 bg-emerald-50"
                      >
                        Connected
                      </Badge>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="h-8 w-8 text-amber-500" />
                        <div>
                          <h3 className="font-medium">Warehouse Management</h3>
                          <p className="text-sm text-muted-foreground">
                            Not connected
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="h-8 w-8 text-emerald-500" />
                        <div>
                          <h3 className="font-medium">Financial Database</h3>
                          <p className="text-sm text-muted-foreground">
                            Connected to Oracle Financials
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-emerald-500 border-emerald-200 bg-emerald-50"
                      >
                        Connected
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Data Source
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Integrations</CardTitle>
                    <CardDescription>
                      Configure API integrations for AI agents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WebhookIcon className="h-8 w-8 text-indigo-500" />
                        <div>
                          <h3 className="font-medium">Slack</h3>
                          <p className="text-sm text-muted-foreground">
                            Send AI insights to Slack channels
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WebhookIcon className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-medium">Microsoft Teams</h3>
                          <p className="text-sm text-muted-foreground">
                            Share AI reports in Teams channels
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WebhookIcon className="h-8 w-8 text-emerald-500" />
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <p className="text-sm text-muted-foreground">
                            Send scheduled reports via email
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <WebhookIcon className="h-8 w-8 text-rose-500" />
                        <div>
                          <h3 className="font-medium">Zapier</h3>
                          <p className="text-sm text-muted-foreground">
                            Connect AI agents to 5,000+ apps
                          </p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Integration
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Configure AI security and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="data-encryption"
                          className="font-medium"
                        >
                          Data Encryption
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Encrypt all data sent to and from AI models
                        </p>
                      </div>
                      <Switch id="data-encryption" defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pii-detection" className="font-medium">
                          PII Detection & Redaction
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically detect and redact personal information
                        </p>
                      </div>
                      <Switch id="pii-detection" defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="audit-logging" className="font-medium">
                          Audit Logging
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Log all AI interactions for compliance and security
                        </p>
                      </div>
                      <Switch id="audit-logging" defaultChecked />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="data-retention" className="font-medium">
                        Data Retention Period
                      </Label>
                      <Select defaultValue="90">
                        <SelectTrigger id="data-retention">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        How long to retain AI interaction data
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Access Control</CardTitle>
                    <CardDescription>
                      Configure who can access AI agents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="access-level" className="font-medium">
                        Default Access Level
                      </Label>
                      <Select defaultValue="team">
                        <SelectTrigger id="access-level">
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            Public (All users)
                          </SelectItem>
                          <SelectItem value="team">Team Only</SelectItem>
                          <SelectItem value="restricted">Restricted</SelectItem>
                          <SelectItem value="admin">Admins Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Who can access AI agents by default
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="font-medium">
                        Agent-Specific Access
                      </Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-emerald-500" />
                            <span>Financial Agent</span>
                          </div>
                          <Select defaultValue="restricted">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select access" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="team">Team Only</SelectItem>
                              <SelectItem value="restricted">
                                Restricted
                              </SelectItem>
                              <SelectItem value="admin">Admins Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            <span>Inventory Agent</span>
                          </div>
                          <Select defaultValue="team">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select access" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="team">Team Only</SelectItem>
                              <SelectItem value="restricted">
                                Restricted
                              </SelectItem>
                              <SelectItem value="admin">Admins Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-amber-500" />
                            <span>Sales Agent</span>
                          </div>
                          <Select defaultValue="team">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select access" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="team">Team Only</SelectItem>
                              <SelectItem value="restricted">
                                Restricted
                              </SelectItem>
                              <SelectItem value="admin">Admins Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-auth" className="font-medium">
                          Require Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Require users to be authenticated to use AI agents
                        </p>
                      </div>
                      <Switch id="require-auth" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Filtering</CardTitle>
                    <CardDescription>
                      Configure content filtering settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="content-filter" className="font-medium">
                          Enable Content Filtering
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Filter inappropriate or sensitive content
                        </p>
                      </div>
                      <Switch id="content-filter" defaultChecked />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="filter-level" className="font-medium">
                        Filtering Level
                      </Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="filter-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            Low (Minimal filtering)
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium (Standard filtering)
                          </SelectItem>
                          <SelectItem value="high">
                            High (Strict filtering)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        How strictly to filter content
                      </p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="custom-blocklist"
                          className="font-medium"
                        >
                          Custom Blocklist
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Block specific topics or keywords
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
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

function WebhookIcon(props: any) {
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
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.43-2.22-.26-3.07A4 4 0 0 1 17 6.05c.01.57-.15 1.13-.48 1.65" />
      <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
    </svg>
  );
}
