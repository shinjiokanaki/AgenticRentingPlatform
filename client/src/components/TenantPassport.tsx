import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Plus, X } from "lucide-react";

interface TenantPassportData {
  salaryAnnual?: number;
  salaryBand?: string;
  employer?: string;
  householdSize?: number;
  hasPets?: boolean;
  petDetails?: string;
  moveInFrom?: string;
  moveInTo?: string;
  maxBudget?: number;
  mustHaves: string[];
  redFlags: string[];
  visible: boolean;
  shareFields: {
    salaryBand?: boolean;
    moveIn?: boolean;
    pets?: boolean;
    docsStatus?: boolean;
  };
}

interface TenantPassportProps {
  data?: TenantPassportData;
  onSave?: (data: TenantPassportData) => void;
}

export default function TenantPassport({ data, onSave }: TenantPassportProps) {
  const [passport, setPassport] = useState<TenantPassportData>(data || {
    salaryAnnual: 0,
    salaryBand: "",
    employer: "",
    householdSize: 1,
    hasPets: false,
    petDetails: "",
    moveInFrom: "",
    moveInTo: "",
    maxBudget: 2000,
    mustHaves: [],
    redFlags: [],
    visible: true,
    shareFields: {
      salaryBand: true,
      moveIn: true,
      pets: true,
      docsStatus: true,
    },
  });

  const [newMustHave, setNewMustHave] = useState("");
  const [newRedFlag, setNewRedFlag] = useState("");

  const calculateCompleteness = () => {
    const fields = [
      passport.salaryAnnual,
      passport.employer,
      passport.moveInFrom,
      passport.maxBudget,
    ];
    const filled = fields.filter(f => f && f !== "" && f !== 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const addMustHave = () => {
    if (newMustHave.trim()) {
      setPassport({
        ...passport,
        mustHaves: [...passport.mustHaves, newMustHave.trim()],
      });
      setNewMustHave("");
    }
  };

  const removeMustHave = (index: number) => {
    setPassport({
      ...passport,
      mustHaves: passport.mustHaves.filter((_, i) => i !== index),
    });
  };

  const addRedFlag = () => {
    if (newRedFlag.trim()) {
      setPassport({
        ...passport,
        redFlags: [...passport.redFlags, newRedFlag.trim()],
      });
      setNewRedFlag("");
    }
  };

  const removeRedFlag = (index: number) => {
    setPassport({
      ...passport,
      redFlags: passport.redFlags.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    console.log('Saving passport:', passport);
    onSave?.(passport);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="space-y-6">
      <Card className="p-6" data-testid="card-tenant-passport">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Tenant Passport</h2>
              <p className="text-sm text-muted-foreground">
                Complete your profile to get better matches
              </p>
            </div>
            <div className="flex items-center gap-2">
              {passport.visible ? (
                <Eye className="w-5 h-5 text-green-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              )}
              <Badge variant={passport.visible ? "default" : "secondary"}>
                {passport.visible ? "Visible to Landlords" : "Hidden"}
              </Badge>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completeness</span>
              <span className="text-sm font-mono">{completeness}%</span>
            </div>
            <Progress value={completeness} />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary (£)</Label>
              <Input
                id="salary"
                type="number"
                value={passport.salaryAnnual}
                onChange={(e) => setPassport({ ...passport, salaryAnnual: parseInt(e.target.value) })}
                data-testid="input-salary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employer">Employer</Label>
              <Input
                id="employer"
                value={passport.employer}
                onChange={(e) => setPassport({ ...passport, employer: e.target.value })}
                data-testid="input-employer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Max Monthly Budget (£)</Label>
              <Input
                id="budget"
                type="number"
                value={passport.maxBudget}
                onChange={(e) => setPassport({ ...passport, maxBudget: parseInt(e.target.value) })}
                data-testid="input-budget"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="household">Household Size</Label>
              <Input
                id="household"
                type="number"
                value={passport.householdSize}
                onChange={(e) => setPassport({ ...passport, householdSize: parseInt(e.target.value) })}
                data-testid="input-household"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moveFrom">Move-in From</Label>
              <Input
                id="moveFrom"
                type="date"
                value={passport.moveInFrom}
                onChange={(e) => setPassport({ ...passport, moveInFrom: e.target.value })}
                data-testid="input-move-from"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moveTo">Move-in To</Label>
              <Input
                id="moveTo"
                type="date"
                value={passport.moveInTo}
                onChange={(e) => setPassport({ ...passport, moveInTo: e.target.value })}
                data-testid="input-move-to"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Have Pets?</Label>
              <Switch
                checked={passport.hasPets}
                onCheckedChange={(checked) => setPassport({ ...passport, hasPets: checked })}
                data-testid="switch-pets"
              />
            </div>
            {passport.hasPets && (
              <Input
                placeholder="Pet details (e.g., 1 small dog)"
                value={passport.petDetails}
                onChange={(e) => setPassport({ ...passport, petDetails: e.target.value })}
                data-testid="input-pet-details"
              />
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Must-Haves</Label>
            <p className="text-sm text-muted-foreground">
              Features you absolutely need in a property
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Pets allowed, Furnished"
                value={newMustHave}
                onChange={(e) => setNewMustHave(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMustHave()}
                data-testid="input-must-have"
              />
              <Button onClick={addMustHave} size="icon" data-testid="button-add-must-have">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {passport.mustHaves.map((item, index) => (
                <Badge key={index} variant="default" className="gap-2" data-testid={`badge-must-have-${index}`}>
                  {item}
                  <button onClick={() => removeMustHave(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Red Flags (Deal Breakers)</Label>
            <p className="text-sm text-muted-foreground">
              Features that are absolute no-gos for you
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., No pets, Students only"
                value={newRedFlag}
                onChange={(e) => setNewRedFlag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRedFlag()}
                data-testid="input-red-flag"
              />
              <Button onClick={addRedFlag} size="icon" variant="destructive" data-testid="button-add-red-flag">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {passport.redFlags.map((item, index) => (
                <Badge key={index} variant="destructive" className="gap-2" data-testid={`badge-red-flag-${index}`}>
                  {item}
                  <button onClick={() => removeRedFlag(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Visibility Controls</Label>
            <p className="text-sm text-muted-foreground">
              Choose what landlords can see when scouting tenants
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Discoverable by landlords</p>
                  <p className="text-sm text-muted-foreground">
                    Allow landlords to find and invite you
                  </p>
                </div>
                <Switch
                  checked={passport.visible}
                  onCheckedChange={(checked) => setPassport({ ...passport, visible: checked })}
                  data-testid="switch-visible"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Show salary band</span>
                <Switch
                  checked={passport.shareFields.salaryBand}
                  onCheckedChange={(checked) =>
                    setPassport({
                      ...passport,
                      shareFields: { ...passport.shareFields, salaryBand: checked },
                    })
                  }
                  data-testid="switch-share-salary"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Show move-in window</span>
                <Switch
                  checked={passport.shareFields.moveIn}
                  onCheckedChange={(checked) =>
                    setPassport({
                      ...passport,
                      shareFields: { ...passport.shareFields, moveIn: checked },
                    })
                  }
                  data-testid="switch-share-move-in"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Show pets status</span>
                <Switch
                  checked={passport.shareFields.pets}
                  onCheckedChange={(checked) =>
                    setPassport({
                      ...passport,
                      shareFields: { ...passport.shareFields, pets: checked },
                    })
                  }
                  data-testid="switch-share-pets"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Show document completion</span>
                <Switch
                  checked={passport.shareFields.docsStatus}
                  onCheckedChange={(checked) =>
                    setPassport({
                      ...passport,
                      shareFields: { ...passport.shareFields, docsStatus: checked },
                    })
                  }
                  data-testid="switch-share-docs"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full" size="lg" data-testid="button-save-passport">
            Save Tenant Passport
          </Button>
        </div>
      </Card>
    </div>
  );
}
