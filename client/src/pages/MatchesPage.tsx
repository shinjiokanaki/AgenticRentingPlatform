import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Calendar, FileText, MapPin, Home } from "lucide-react";

interface Match {
  id: string;
  tenant: {
    id: string;
    name: string;
  };
  landlord: {
    id: string;
    name: string;
  };
  property: {
    id: string;
    title: string;
    address: string;
    rentPcm: number;
    image: string;
  };
  matchPercentage: number;
  status: "pending" | "matched" | "stale";
  createdAt: Date;
}

export default function MatchesPage() {
  const mockMatches: Match[] = [
    {
      id: '1',
      tenant: { id: '1', name: 'Sarah Mitchell' },
      landlord: { id: '2', name: 'John Smith' },
      property: {
        id: '1',
        title: 'Modern 2-Bed Apartment',
        address: 'Shoreditch, London E1',
        rentPcm: 1850,
        image: '/placeholder.jpg',
      },
      matchPercentage: 88,
      status: 'matched',
      createdAt: new Date('2025-01-10'),
    },
    {
      id: '2',
      tenant: { id: '1', name: 'Sarah Mitchell' },
      landlord: { id: '3', name: 'Emma Wilson' },
      property: {
        id: '2',
        title: 'Spacious 3-Bed Flat',
        address: 'Camden, London NW1',
        rentPcm: 2100,
        image: '/placeholder.jpg',
      },
      matchPercentage: 72,
      status: 'pending',
      createdAt: new Date('2025-01-11'),
    },
  ];

  const activeMatches = mockMatches.filter(m => m.status === 'matched');
  const pendingMatches = mockMatches.filter(m => m.status === 'pending');

  const MatchCard = ({ match }: { match: Match }) => (
    <Card className="p-6" data-testid={`card-match-${match.id}`}>
      <div className="flex gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
            <Home className="w-full h-full p-6 text-muted-foreground" />
          </div>
          <Badge
            className="absolute -top-2 -right-2"
            variant={match.status === "matched" ? "default" : "secondary"}
          >
            {match.matchPercentage}%
          </Badge>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold" data-testid="text-property-title">
                {match.property.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{match.property.address}</span>
              </div>
              <p className="text-sm font-mono mt-1">£{match.property.rentPcm.toLocaleString()}/mo</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {match.landlord.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{match.landlord.name}</span>
          </div>

          {match.status === 'matched' && (
            <div className="flex gap-2">
              <Button size="sm" data-testid="button-message">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button size="sm" variant="outline" data-testid="button-book-viewing">
                <Calendar className="w-4 h-4 mr-2" />
                Book Viewing
              </Button>
              <Button size="sm" variant="outline" data-testid="button-make-offer">
                <FileText className="w-4 h-4 mr-2" />
                Make Offer
              </Button>
            </div>
          )}

          {match.status === 'pending' && (
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Waiting for response</Badge>
              <span className="text-sm text-muted-foreground">
                Sent {match.createdAt.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Your Matches</h1>
          <p className="text-muted-foreground">
            Properties where both you and the landlord have shown interest
          </p>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active" data-testid="tab-active">
              Active Matches ({activeMatches.length})
            </TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">
              Pending ({pendingMatches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {activeMatches.length > 0 ? (
              activeMatches.map((match) => <MatchCard key={match.id} match={match} />)
            ) : (
              <Card className="p-12 text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No active matches yet</h3>
                  <p className="text-muted-foreground">
                    Start swiping on properties to create matches!
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6 space-y-4">
            {pendingMatches.length > 0 ? (
              pendingMatches.map((match) => <MatchCard key={match.id} match={match} />)
            ) : (
              <Card className="p-12 text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No pending matches</h3>
                  <p className="text-muted-foreground">
                    All your matches have been accepted!
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
