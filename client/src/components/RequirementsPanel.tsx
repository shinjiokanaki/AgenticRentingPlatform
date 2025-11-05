import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export interface Requirement {
  label: string;
  met: boolean;
  critical?: boolean;
}

interface RequirementsPanelProps {
  requirements: Requirement[];
}

export default function RequirementsPanel({ requirements }: RequirementsPanelProps) {
  const metCount = requirements.filter(r => r.met).length;
  const totalCount = requirements.length;

  return (
    <Card className="p-6" data-testid="panel-requirements">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Requirements</h3>
          <Badge variant={metCount === totalCount ? "default" : "secondary"}>
            {metCount}/{totalCount} met
          </Badge>
        </div>

        <div className="space-y-3">
          {requirements.map((req, index) => (
            <div
              key={index}
              className="flex items-start gap-3"
              data-testid={`requirement-${index}`}
            >
              {req.met ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : req.critical ? (
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm ${req.met ? "text-foreground" : "text-muted-foreground"}`}>
                  {req.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
