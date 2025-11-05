import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MatchBadge from "@/components/MatchBadge";
import RequirementsPanel from "@/components/RequirementsPanel";
import GapsExplainer from "@/components/GapsExplainer";
import ViewingSlotPicker from "@/components/ViewingSlotPicker";
import OfferModal from "@/components/OfferModal";
import { MapPin, Bed, Bath, Calendar, FileText } from "lucide-react";
import property1 from '@assets/generated_images/Modern_apartment_living_room_0fd4cb01.png';
import property2 from '@assets/generated_images/Contemporary_kitchen_interior_e4e41d17.png';
import property3 from '@assets/generated_images/Cozy_modern_bedroom_6337e6c0.png';

export default function PropertyDetailPage() {
  const [offerOpen, setOfferOpen] = useState(false);

  const images = [property1, property2, property3];
  const [currentImage, setCurrentImage] = useState(0);

  const requirements = [
    { label: 'Income 2.8× monthly rent (£5,180/month)', met: true },
    { label: 'Pets allowed', met: true },
    { label: 'Move-in window matches (Jan 15 - Feb 1)', met: true },
    { label: 'Previous landlord reference', met: false, critical: true },
    { label: 'Employment verification letter', met: false },
  ];

  const viewingSlots = [
    { id: '1', start: new Date('2025-01-15T10:00:00'), end: new Date('2025-01-15T10:30:00'), available: true },
    { id: '2', start: new Date('2025-01-15T14:00:00'), end: new Date('2025-01-15T14:30:00'), available: true },
    { id: '3', start: new Date('2025-01-16T11:00:00'), end: new Date('2025-01-16T11:30:00'), available: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={images[currentImage]}
                alt="Property"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImage ? "bg-white" : "bg-white/50"
                    }`}
                    data-testid={`button-image-${index}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-semibold" data-testid="text-property-title">
                      Modern 2-Bed Apartment
                    </h1>
                    <MatchBadge label="Likely" score={85} />
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>123 Brick Lane, Shoreditch, London E1 6PU</span>
                  </div>
                </div>
              </div>

              <Card className="p-6 mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-mono text-3xl font-semibold">£1,850</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    <span>2 bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4" />
                    <span>1 bathroom</span>
                  </div>
                  <Badge variant="secondary">Furnished</Badge>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground">
                  Beautiful modern apartment in the heart of Shoreditch. Recently renovated with high-quality
                  finishes throughout. Open-plan living/kitchen area with plenty of natural light. Close to
                  transport links, restaurants, and shops. Available from mid-January 2025.
                </p>
              </Card>

              <GapsExplainer
                strengths={[
                  'Income multiple met (3.2× monthly rent)',
                  'Move-in date aligns perfectly with availability',
                  'Pets policy matches your needs',
                ]}
                gaps={[
                  'Missing previous landlord reference - required for approval',
                  'Employment verification letter would strengthen application',
                ]}
              />
            </div>
          </div>

          <div className="space-y-6">
            <RequirementsPanel requirements={requirements} />
            
            <ViewingSlotPicker
              slots={viewingSlots}
              onBook={(id) => console.log('Booked:', id)}
            />

            <div className="space-y-3">
              <Button className="w-full" size="lg" onClick={() => setOfferOpen(true)} data-testid="button-make-offer">
                <FileText className="w-4 h-4 mr-2" />
                Make an Offer
              </Button>
              <Button variant="outline" className="w-full" size="lg" data-testid="button-save">
                Save Property
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OfferModal
        open={offerOpen}
        onOpenChange={setOfferOpen}
        propertyPrice={1850}
        onSubmit={(offer) => console.log('Offer:', offer)}
      />
    </div>
  );
}
