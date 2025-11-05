import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, Calendar, DollarSign } from "lucide-react";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch?: (query: SearchQuery) => void;
}

export interface SearchQuery {
  location: string;
  rentMin?: number;
  rentMax?: number;
  beds?: number;
  moveInFrom?: string;
  pets?: boolean;
  furnished?: boolean;
}

export default function SearchModal({ open, onOpenChange, onSearch }: SearchModalProps) {
  const [query, setQuery] = useState<SearchQuery>({
    location: "",
    rentMax: 2000,
    beds: 2,
  });

  const handleSearch = () => {
    console.log('Search triggered:', query);
    onSearch?.(query);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="modal-search">
        <DialogHeader>
          <DialogTitle className="text-2xl">Find your next home</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="e.g., Shoreditch, Zone 2, East London"
                className="pl-10"
                value={query.location}
                onChange={(e) => setQuery({ ...query, location: e.target.value })}
                data-testid="input-location"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rentMax">Max Monthly Rent</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="rentMax"
                  type="number"
                  placeholder="2000"
                  className="pl-10"
                  value={query.rentMax}
                  onChange={(e) => setQuery({ ...query, rentMax: parseInt(e.target.value) })}
                  data-testid="input-rent-max"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="beds">Bedrooms</Label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="beds"
                  type="number"
                  placeholder="2"
                  className="pl-10"
                  value={query.beds}
                  onChange={(e) => setQuery({ ...query, beds: parseInt(e.target.value) })}
                  data-testid="input-beds"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moveInFrom">Move-in Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="moveInFrom"
                type="date"
                className="pl-10"
                value={query.moveInFrom}
                onChange={(e) => setQuery({ ...query, moveInFrom: e.target.value })}
                data-testid="input-move-in"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferences</Label>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={query.pets ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                onClick={() => setQuery({ ...query, pets: !query.pets })}
                data-testid="badge-filter-pets"
              >
                Pets Allowed
              </Badge>
              <Badge
                variant={query.furnished ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                onClick={() => setQuery({ ...query, furnished: !query.furnished })}
                data-testid="badge-filter-furnished"
              >
                Furnished
              </Badge>
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full" size="lg" data-testid="button-search">
            <Search className="w-4 h-4 mr-2" />
            Search Properties
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
