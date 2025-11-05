import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SearchModal from "@/components/SearchModal";
import PropertyCard from "@/components/PropertyCard";
import { Search, Home, Shield, Zap } from "lucide-react";
import heroImage from '@assets/generated_images/London_cityscape_hero_ee2eb187.png';
import property1 from '@assets/generated_images/Modern_apartment_living_room_0fd4cb01.png';
import property2 from '@assets/generated_images/Contemporary_kitchen_interior_e4e41d17.png';
import property3 from '@assets/generated_images/Loft_apartment_interior_09c6b1de.png';

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);

  const mockProperties = [
    {
      id: '1',
      image: property1,
      price: 1850,
      address: 'Shoreditch, London E1',
      beds: 2,
      baths: 1,
      matchLabel: 'Likely' as const,
      matchScore: 85,
      reason: 'Income multiple met, move-in fits',
    },
    {
      id: '2',
      image: property2,
      price: 2100,
      address: 'Camden, London NW1',
      beds: 3,
      baths: 2,
      matchLabel: 'Maybe' as const,
      matchScore: 62,
      reason: 'Slightly over budget, pets allowed',
    },
    {
      id: '3',
      image: property3,
      price: 2400,
      address: 'Clerkenwell, London EC1',
      beds: 2,
      baths: 2,
      matchLabel: 'Unlikely' as const,
      matchScore: 45,
      reason: 'Guarantor required, over budget',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="London cityscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl font-semibold text-white mb-4" data-testid="text-hero-title">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            AI-powered matching shows you properties you're likely to get. Search smarter, not harder.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => setSearchOpen(true)}
            data-testid="button-search-hero"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Properties
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Matching</h3>
            <p className="text-sm text-muted-foreground">
              See your likelihood to get each property based on income, timing, and requirements
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Document Vault</h3>
            <p className="text-sm text-muted-foreground">
              Upload documents once, share securely with landlords when making offers
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Full Lifecycle Support</h3>
            <p className="text-sm text-muted-foreground">
              From search to move-in: viewings, offers, checks, deposits all in one place
            </p>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2">Featured Properties</h2>
          <p className="text-muted-foreground">Properties that match your profile</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
              onClick={() => console.log('Property clicked:', property.id)}
            />
          ))}
        </div>
      </div>

      <SearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSearch={(query) => console.log('Search:', query)}
      />
    </div>
  );
}
