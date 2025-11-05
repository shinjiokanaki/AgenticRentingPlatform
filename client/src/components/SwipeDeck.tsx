import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";

export interface SwipeCard {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  matchPercentage: number;
  matchCategory: string;
  details: Array<{ label: string; value: string }>;
  reasons: string[];
}

interface SwipeDeckProps {
  cards: SwipeCard[];
  onSwipe?: (cardId: string, action: "like" | "pass" | "superlike") => void;
  onComplete?: () => void;
}

export default function SwipeDeck({ cards, onSwipe, onComplete }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const currentCard = cards[currentIndex];

  const handleSwipe = (action: "like" | "pass" | "superlike") => {
    if (!currentCard) return;

    console.log(`Swiped ${action} on`, currentCard.id);
    onSwipe?.(currentCard.id, action);

    if (action === "like" || action === "superlike") {
      setDirection("right");
    } else {
      setDirection("left");
    }

    setTimeout(() => {
      setDirection(null);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete?.();
      }
    }, 300);
  };

  const getBadgeVariant = (category: string) => {
    if (category.includes("76-100")) return "default";
    if (category.includes("51-75")) return "secondary";
    if (category.includes("26-50")) return "outline";
    return "destructive";
  };

  if (!currentCard) {
    return (
      <Card className="p-12 text-center" data-testid="card-deck-empty">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold">All Done!</h3>
          <p className="text-muted-foreground">
            You've reviewed all available cards. Check back later for more matches!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto" data-testid="deck-swipe">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {cards.length}
        </span>
        <Badge variant={getBadgeVariant(currentCard.matchCategory)}>
          {currentCard.matchPercentage}% Match • {currentCard.matchCategory}
        </Badge>
      </div>

      <Card
        className={`overflow-hidden transition-all duration-300 ${
          direction === "left"
            ? "translate-x-[-100%] opacity-0"
            : direction === "right"
            ? "translate-x-[100%] opacity-0"
            : ""
        }`}
        data-testid="card-current"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={currentCard.image}
            alt={currentCard.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-semibold text-white mb-1" data-testid="text-card-title">
              {currentCard.title}
            </h2>
            <p className="text-sm text-white/90">{currentCard.subtitle}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {currentCard.details.map((detail, index) => (
              <div key={index} className="space-y-1">
                <p className="text-xs text-muted-foreground">{detail.label}</p>
                <p className="font-medium">{detail.value}</p>
              </div>
            ))}
          </div>

          {currentCard.reasons.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Why this match:</p>
              <ul className="space-y-1">
                {currentCard.reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2"
          onClick={() => handleSwipe("pass")}
          data-testid="button-pass"
        >
          <X className="w-8 h-8 text-destructive" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-20 w-20 rounded-full border-2"
          onClick={() => handleSwipe("superlike")}
          data-testid="button-superlike"
        >
          <Star className="w-10 h-10 text-yellow-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2"
          onClick={() => handleSwipe("like")}
          data-testid="button-like"
        >
          <Heart className="w-8 h-8 text-green-600" />
        </Button>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <X className="w-4 h-4" />
          <span>Pass</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span>Super Like</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          <span>Like</span>
        </div>
      </div>
    </div>
  );
}
