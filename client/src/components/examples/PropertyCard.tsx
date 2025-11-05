import PropertyCard from '../PropertyCard';
import property1 from '@assets/generated_images/Modern_apartment_living_room_0fd4cb01.png';

export default function PropertyCardExample() {
  return (
    <div className="max-w-sm">
      <PropertyCard
        id="1"
        image={property1}
        price={1850}
        address="Shoreditch, London E1"
        beds={2}
        baths={1}
        matchLabel="Likely"
        matchScore={85}
        reason="Income multiple met, move-in fits"
        onClick={() => console.log('Property clicked')}
      />
    </div>
  );
}
