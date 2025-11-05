import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

export interface ViewingSlot {
  id: string;
  start: Date;
  end: Date;
  available: boolean;
}

interface ViewingSlotPickerProps {
  slots: ViewingSlot[];
  onBook?: (slotId: string) => void;
}

export default function ViewingSlotPicker({ slots, onBook }: ViewingSlotPickerProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const handleBook = () => {
    if (selectedSlot) {
      console.log('Booking slot:', selectedSlot);
      onBook?.(selectedSlot);
    }
  };

  return (
    <Card className="p-6" data-testid="card-viewing-slots">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Viewing Slots</h3>

        <div className="space-y-2">
          {slots.map((slot) => (
            <Card
              key={slot.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedSlot === slot.id
                  ? "border-primary bg-primary/5"
                  : slot.available
                  ? "hover-elevate"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => slot.available && setSelectedSlot(slot.id)}
              data-testid={`slot-${slot.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{formatDate(slot.start)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatTime(slot.start)} - {formatTime(slot.end)}
                    </span>
                  </div>
                </div>
                {!slot.available && (
                  <Badge variant="secondary">Booked</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {selectedSlot && (
          <Button onClick={handleBook} className="w-full" data-testid="button-book-viewing">
            Book This Viewing
          </Button>
        )}
      </div>
    </Card>
  );
}
