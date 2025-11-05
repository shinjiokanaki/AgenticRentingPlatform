import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Plus,
  Edit,
  Pause,
  Copy,
  Trash2,
  Eye,
  Users,
  Calendar,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface Property {
  id: string;
  title: string;
  address: string;
  rentPcm: number;
  beds: number;
  status: "live" | "draft" | "paused";
  imageUrl?: string;
  views: number;
  hotTenants: number;
  invites: number;
  viewings: number;
}

interface TenantCandidate {
  id: string;
  name: string;
  scorePT: number;
  label: "Hot" | "Warm" | "Cold";
  affordability: number;
  docsCompleteness: number;
  moveIn: string;
  household: number;
  hasPets: boolean;
}

export default function LandlordDashboardPage() {
  const [, setLocation] = useLocation();

  // Mock data - replace with real data from API
  const [properties] = useState<Property[]>([
    {
      id: "1",
      title: "Cortland at Colliers Yard",
      address: "Salford, M3",
      rentPcm: 2910,
      beds: 3,
      status: "live",
      views: 142,
      hotTenants: 8,
      invites: 3,
      viewings: 2,
    },
    {
      id: "2",
      title: "Modern City Centre Apartment",
      address: "Manchester, M1",
      rentPcm: 1850,
      beds: 2,
      status: "live",
      views: 89,
      hotTenants: 5,
      invites: 1,
      viewings: 1,
    },
    {
      id: "3",
      title: "Luxury Penthouse Suite",
      address: "MediaCityUK, M50",
      rentPcm: 3500,
      beds: 3,
      status: "draft",
      views: 0,
      hotTenants: 0,
      invites: 0,
      viewings: 0,
    },
  ]);

  const [tenantPool] = useState<TenantCandidate[]>([
    {
      id: "t1",
      name: "Sarah Johnson",
      scorePT: 85,
      label: "Hot",
      affordability: 95,
      docsCompleteness: 80,
      moveIn: "Nov 2025",
      household: 2,
      hasPets: false,
    },
    {
      id: "t2",
      name: "Michael Chen",
      scorePT: 72,
      label: "Warm",
      affordability: 88,
      docsCompleteness: 60,
      moveIn: "Dec 2025",
      household: 1,
      hasPets: true,
    },
  ]);

  const getStatusColor = (status: Property["status"]) => {
    switch (status) {
      case "live":
        return "bg-green-500 dark:bg-green-600";
      case "draft":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "paused":
        return "bg-gray-500 dark:bg-gray-600";
    }
  };

  const getLabelColor = (label: TenantCandidate["label"]) => {
    switch (label) {
      case "Hot":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Warm":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Cold":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Landlord Dashboard</h1>
            <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
              Manage your properties and discover qualified tenants
            </p>
          </div>
          <Button onClick={() => setLocation("/landlord/onboarding")} data-testid="button-add-property">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList data-testid="tabs-dashboard">
            <TabsTrigger value="properties" data-testid="tab-properties">
              <Building2 className="mr-2 h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="scout" data-testid="tab-scout">
              <Search className="mr-2 h-4 w-4" />
              Tenant Pool (Scout)
            </TabsTrigger>
            <TabsTrigger value="matches" data-testid="tab-matches">
              <Users className="mr-2 h-4 w-4" />
              Invites & Matches
            </TabsTrigger>
            <TabsTrigger value="calendar" data-testid="tab-calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="insights" data-testid="tab-insights">
              <TrendingUp className="mr-2 h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property.id} className="hover-elevate" data-testid={`card-property-${property.id}`}>
                  <CardHeader className="space-y-0 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2" data-testid={`text-property-title-${property.id}`}>
                        {property.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn("shrink-0", getStatusColor(property.status))}
                        data-testid={`badge-status-${property.id}`}
                      >
                        {property.status}
                      </Badge>
                    </div>
                    <CardDescription data-testid={`text-property-address-${property.id}`}>{property.address}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold" data-testid={`text-rent-${property.id}`}>
                        £{property.rentPcm}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {property.beds} bed
                      </span>
                    </div>

                    {property.status === "live" && (
                      <div className="grid grid-cols-4 gap-2 text-center text-sm">
                        <div>
                          <div className="font-semibold" data-testid={`text-views-${property.id}`}>{property.views}</div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        <div>
                          <div className="font-semibold text-green-600" data-testid={`text-hot-${property.id}`}>
                            {property.hotTenants}
                          </div>
                          <div className="text-xs text-muted-foreground">Hot</div>
                        </div>
                        <div>
                          <div className="font-semibold" data-testid={`text-invites-${property.id}`}>{property.invites}</div>
                          <div className="text-xs text-muted-foreground">Invites</div>
                        </div>
                        <div>
                          <div className="font-semibold" data-testid={`text-viewings-${property.id}`}>{property.viewings}</div>
                          <div className="text-xs text-muted-foreground">Viewings</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2">
                    <Button size="sm" variant="ghost" data-testid={`button-edit-${property.id}`}>
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" data-testid={`button-pause-${property.id}`}>
                      <Pause className="mr-1 h-3 w-3" />
                      Pause
                    </Button>
                    <Button size="sm" variant="ghost" data-testid={`button-duplicate-${property.id}`}>
                      <Copy className="mr-1 h-3 w-3" />
                      Duplicate
                    </Button>
                    <Button size="sm" variant="ghost" data-testid={`button-archive-${property.id}`}>
                      <Trash2 className="mr-1 h-3 w-3" />
                      Archive
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tenant Pool (Scout) Tab */}
          <TabsContent value="scout" className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" data-testid="button-filter">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <div className="text-sm text-muted-foreground" data-testid="text-tenant-count">
                {tenantPool.length} qualified tenants found
              </div>
            </div>

            <div className="grid gap-4">
              {tenantPool.map((tenant) => (
                <Card key={tenant.id} className="hover-elevate" data-testid={`card-tenant-${tenant.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle data-testid={`text-tenant-name-${tenant.id}`}>{tenant.name}</CardTitle>
                        <CardDescription>
                          Move-in: {tenant.moveIn} • Household: {tenant.household} • Pets: {tenant.hasPets ? "Yes" : "No"}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-3xl font-bold text-primary" data-testid={`text-score-${tenant.id}`}>
                          {tenant.scorePT}%
                        </div>
                        <Badge
                          variant="outline"
                          className={getLabelColor(tenant.label)}
                          data-testid={`badge-label-${tenant.id}`}
                        >
                          {tenant.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Affordability</span>
                          <span className="font-medium" data-testid={`text-affordability-${tenant.id}`}>
                            {tenant.affordability}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${tenant.affordability}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Docs Complete</span>
                          <span className="font-medium" data-testid={`text-docs-${tenant.id}`}>
                            {tenant.docsCompleteness}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${tenant.docsCompleteness}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button size="sm" data-testid={`button-invite-${tenant.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Invite to Viewing
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-preapprove-${tenant.id}`}>
                      Pre-approve
                    </Button>
                    <Button size="sm" variant="ghost" data-testid={`button-pass-${tenant.id}`}>
                      Pass
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Invites & Matches Tab */}
          <TabsContent value="matches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Match Pipeline</CardTitle>
                <CardDescription>Track your tenant applications from invite to move-in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-12" data-testid="text-no-matches">
                  No active matches yet. Use Scout Mode to discover and invite qualified tenants.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Viewing Calendar</CardTitle>
                <CardDescription>Manage your property viewing slots and bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-12" data-testid="text-no-viewings">
                  No viewings scheduled. Add viewing slots to your properties.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Price Suggestions</CardTitle>
                  <CardDescription>Optimize your rental pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground" data-testid="text-price-insight">
                    Your properties are competitively priced for the market.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Amenity Highlights</CardTitle>
                  <CardDescription>Most valued features by tenants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gym / Fitness</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pet Friendly</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Coworking Space</span>
                      <span className="font-medium">65%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
