import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ProfileData {
  maxBudget: number;
  householdSize: number;
  salary: number;
  employer: string;
  moveInFrom: string;
  pets: boolean;
}

interface ProfileStepperProps {
  onComplete?: (data: ProfileData) => void;
}

export default function ProfileStepper({ onComplete }: ProfileStepperProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ProfileData>({
    maxBudget: 2000,
    householdSize: 1,
    salary: 50000,
    employer: "",
    moveInFrom: "",
    pets: false,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log('Profile complete:', data);
      onComplete?.(data);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Card className="p-6 max-w-2xl" data-testid="card-profile-stepper">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold">Complete Your Profile</h3>
            <Badge>Step {step} of {totalSteps}</Badge>
          </div>
          <Progress value={progress} />
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-medium">Household & Budget</h4>
            <div className="space-y-2">
              <Label htmlFor="budget">Maximum Monthly Budget (£)</Label>
              <Input
                id="budget"
                type="number"
                value={data.maxBudget}
                onChange={(e) => setData({ ...data, maxBudget: parseInt(e.target.value) })}
                data-testid="input-budget"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="household">Household Size</Label>
              <Input
                id="household"
                type="number"
                value={data.householdSize}
                onChange={(e) => setData({ ...data, householdSize: parseInt(e.target.value) })}
                data-testid="input-household"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={data.pets ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                onClick={() => setData({ ...data, pets: !data.pets })}
                data-testid="badge-pets"
              >
                Pets
              </Badge>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-medium">Employment & Salary</h4>
            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary (£)</Label>
              <Input
                id="salary"
                type="number"
                value={data.salary}
                onChange={(e) => setData({ ...data, salary: parseInt(e.target.value) })}
                data-testid="input-salary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employer">Employer</Label>
              <Input
                id="employer"
                value={data.employer}
                onChange={(e) => setData({ ...data, employer: e.target.value })}
                placeholder="Company name"
                data-testid="input-employer"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-medium">Move-in & Preferences</h4>
            <div className="space-y-2">
              <Label htmlFor="moveIn">Earliest Move-in Date</Label>
              <Input
                id="moveIn"
                type="date"
                value={data.moveInFrom}
                onChange={(e) => setData({ ...data, moveInFrom: e.target.value })}
                data-testid="input-move-in"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            data-testid="button-back"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} data-testid="button-next">
            {step === totalSteps ? "Complete" : "Next"}
            {step < totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
