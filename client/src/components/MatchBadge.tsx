import { Badge } from "@/components/ui/badge";

export type MatchLabel = "Likely" | "Maybe" | "Unlikely";

interface MatchBadgeProps {
  label: MatchLabel;
  score?: number;
}

export default function MatchBadge({ label, score }: MatchBadgeProps) {
  const variant = {
    Likely: "default" as const,
    Maybe: "secondary" as const,
    Unlikely: "outline" as const,
  }[label];

  return (
    <Badge variant={variant} className="font-semibold" data-testid={`badge-match-${label.toLowerCase()}`}>
      {label}
      {score !== undefined && ` ${score}%`}
    </Badge>
  );
}
