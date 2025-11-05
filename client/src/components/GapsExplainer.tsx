import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface GapsExplainerProps {
  strengths: string[];
  gaps: string[];
}

export default function GapsExplainer({ strengths, gaps }: GapsExplainerProps) {
  return (
    <Card className="p-6 bg-muted/50" data-testid="card-gaps-explainer">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Application Analysis</h3>

        {strengths.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Strengths</p>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2" data-testid={`strength-${index}`}>
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {gaps.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Gaps to Address</p>
            <ul className="space-y-2">
              {gaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-2" data-testid={`gap-${index}`}>
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
