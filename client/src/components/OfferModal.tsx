import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export interface OfferData {
  rentPcm: number;
  startDate: string;
  termMonths: number;
  conditions?: string;
}

interface OfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyPrice: number;
  onSubmit?: (offer: OfferData) => void;
}

export default function OfferModal({ open, onOpenChange, propertyPrice, onSubmit }: OfferModalProps) {
  const [offer, setOffer] = useState<OfferData>({
    rentPcm: propertyPrice,
    startDate: "",
    termMonths: 12,
    conditions: "",
  });

  const handleSubmit = () => {
    console.log('Offer submitted:', offer);
    onSubmit?.(offer);
    onOpenChange(false);
  };

  const totalCost = offer.rentPcm * offer.termMonths;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl" data-testid="modal-offer">
        <DialogHeader>
          <DialogTitle className="text-2xl">Make an Offer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rent">Monthly Rent (£)</Label>
            <Input
              id="rent"
              type="number"
              value={offer.rentPcm}
              onChange={(e) => setOffer({ ...offer, rentPcm: parseInt(e.target.value) })}
              data-testid="input-rent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={offer.startDate}
                onChange={(e) => setOffer({ ...offer, startDate: e.target.value })}
                data-testid="input-start-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term (months)</Label>
              <Input
                id="term"
                type="number"
                value={offer.termMonths}
                onChange={(e) => setOffer({ ...offer, termMonths: parseInt(e.target.value) })}
                data-testid="input-term"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditions">Special Conditions (Optional)</Label>
            <Textarea
              id="conditions"
              placeholder="Any special requests or conditions..."
              value={offer.conditions}
              onChange={(e) => setOffer({ ...offer, conditions: e.target.value })}
              data-testid="input-conditions"
            />
          </div>

          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly rent:</span>
                <span className="font-mono font-semibold">£{offer.rentPcm.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Term:</span>
                <span className="font-mono">{offer.termMonths} months</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-semibold">Total contract value:</span>
                <span className="font-mono font-semibold text-lg">£{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" data-testid="button-submit-offer">
              Submit Offer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
