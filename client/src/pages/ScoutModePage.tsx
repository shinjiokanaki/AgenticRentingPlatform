import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SwipeDeck from "@/components/SwipeDeck";
import { Search, SlidersHorizontal, Heart, Mail, Eye, MapPin, Calendar, DollarSign } from "lucide-react";

interface TenantProfile {
  id: string;
  name: string;
  salaryBand: string;
  householdSize: number;
  hasPets: boolean;
  moveInWindow: string;
  matchPercentage: number;
  matchCategory: string;
  reasons: string[];
  docsComplete: number;
  replyRate: number;
  distance: string;
}

export default function ScoutModePage() {
  const [view, setView] = useState<"list" | "deck">("list");
  const [propertyFilter, setPropertyFilter] = useState("all");

  const mockTenants: TenantProfile[] = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      salaryBand: '£50k-£60k',
      householdSize: 2,
      hasPets: false,
      moveInWindow: 'Jan 15 - Feb 15',
      matchPercentage: 88,
      matchCategory: '76-100%',
      reasons: [
        'Income 3.2× monthly rent',
        'Move-in timing perfect',
        'All documents uploaded',
      ],
      docsComplete: 100,
      replyRate: 95,
      distance: '0.8 miles',
    },
    {
      id: '2',
      name: 'James Chen',
      salaryBand: '£45k-£55k',
      householdSize: 1,
      hasPets: true,
      moveInWindow: 'Feb 1 - Mar 1',
      matchPercentage: 72,
      matchCategory: '51-75%',
      reasons: [
        'Income 2.9× monthly rent',
        'Has pets (property allows)',
        'Good reply history',
      ],
      docsComplete: 80,
      replyRate: 88,
      distance: '1.2 miles',
    },
    {
      id: '3',
      name: 'Emily Watson',
      salaryBand: '£40k-£50k',
      householdSize: 1,
      hasPets: false,
      moveInWindow: 'Jan 20 - Feb 20',
      matchPercentage: 65,
      matchCategory: '51-75%',
      reasons: [
        'Income 2.5× monthly rent',
        'Move-in window matches',
        'Missing employment letter',
      ],
      docsComplete: 60,
      replyRate: 78,
      distance: '2.1 miles',
    },
  ];

  const swipeCards = mockTenants.map(tenant => ({
    id: tenant.id,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tenant.name}`,
    title: tenant.name,
    subtitle: `${tenant.salaryBand} • ${tenant.distance} away`,
    matchPercentage: tenant.matchPercentage,
    matchCategory: tenant.matchCategory,
    details: [
      { label: 'Household', value: `${tenant.householdSize} ${tenant.householdSize === 1 ? 'person' : 'people'}` },
      { label: 'Pets', value: tenant.hasPets ? 'Yes' : 'No' },
      { label: 'Move-in', value: tenant.moveInWindow },
      { label: 'Docs', value: `${tenant.docsComplete}%` },
    ],
    reasons: tenant.reasons,
  }));

  const getBadgeVariant = (category: string) => {
    if (category.includes("76-100")) return "default";
    if (category.includes("51-75")) return "secondary";
    if (category.includes("26-50")) return "outline";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Scout Mode</h1>
          <p className="text-muted-foreground">
            Discover and invite qualified tenants for your properties
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                className="pl-10"
                data-testid="input-search-tenants"
              />
            </div>
          </div>
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="1">Shoreditch 2-Bed</SelectItem>
              <SelectItem value="2">Camden 3-Bed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-filters">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "deck")}>
          <TabsList>
            <TabsTrigger value="list" data-testid="tab-list">List View</TabsTrigger>
            <TabsTrigger value="deck" data-testid="tab-deck">Swipe Deck</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <div className="space-y-4">
              {mockTenants.map((tenant) => (
                <Card key={tenant.id} className="p-6" data-testid={`card-tenant-${tenant.id}`}>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {tenant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold" data-testid="text-tenant-name">
                            {tenant.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {tenant.salaryBand}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {tenant.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {tenant.moveInWindow}
                            </span>
                          </div>
                        </div>
                        <Badge variant={getBadgeVariant(tenant.matchCategory)}>
                          {tenant.matchPercentage}% • {tenant.matchCategory}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Household</p>
                          <p className="text-sm font-medium">
                            {tenant.householdSize} {tenant.householdSize === 1 ? 'person' : 'people'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Pets</p>
                          <p className="text-sm font-medium">{tenant.hasPets ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Docs</p>
                          <p className="text-sm font-medium">{tenant.docsComplete}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Reply Rate</p>
                          <p className="text-sm font-medium">{tenant.replyRate}%</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Match Reasons:</p>
                        <ul className="space-y-1">
                          {tenant.reasons.map((reason, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="default" data-testid={`button-invite-${tenant.id}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Invite
                        </Button>
                        <Button variant="outline" data-testid={`button-view-${tenant.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-shortlist-${tenant.id}`}>
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deck" className="mt-6">
            <SwipeDeck
              cards={swipeCards}
              onSwipe={(id, action) => console.log('Swiped', action, 'on tenant', id)}
              onComplete={() => console.log('All tenants reviewed!')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
