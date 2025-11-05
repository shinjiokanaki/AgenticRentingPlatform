import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MatchBadge, { type MatchLabel } from "./MatchBadge";
import { MapPin, Bed, Bath } from "lucide-react";

export interface PropertyCardProps {
  id: string;
  image: string;
  price: number;
  address: string;
  beds: number;
  baths?: number;
  matchLabel: MatchLabel;
  matchScore: number;
  reason: string;
  onClick?: () => void;
}

export default function PropertyCard({
  image,
  price,
  address,
  beds,
  baths,
  matchLabel,
  matchScore,
  reason,
  onClick,
}: PropertyCardProps) {
  return (
    <Card
      className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-shadow"
      onClick={onClick}
      data-testid="card-property"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image} alt={address} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4">
          <MatchBadge label={matchLabel} score={matchScore} />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xl font-semibold" data-testid="text-price">
            £{price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span data-testid="text-address">{address}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{beds} bed{beds !== 1 ? 's' : ''}</span>
          </div>
          {baths && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{baths} bath{baths !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <Badge variant="secondary" className="text-xs" data-testid="badge-reason">
          {reason}
        </Badge>
      </div>
    </Card>
  );
}
