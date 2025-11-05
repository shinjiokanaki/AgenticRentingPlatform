import SwipeDeck from '../SwipeDeck';
import property1 from '@assets/generated_images/Modern_apartment_living_room_0fd4cb01.png';
import property2 from '@assets/generated_images/Contemporary_kitchen_interior_e4e41d17.png';
import property3 from '@assets/generated_images/Loft_apartment_interior_09c6b1de.png';

export default function SwipeDeckExample() {
  const mockCards = [
    {
      id: '1',
      image: property1,
      title: 'Modern 2-Bed Apartment',
      subtitle: 'Shoreditch, London E1',
      matchPercentage: 85,
      matchCategory: '76-100%',
      details: [
        { label: 'Rent', value: '£1,850/mo' },
        { label: 'Beds', value: '2' },
        { label: 'Available', value: 'Feb 1, 2025' },
        { label: 'Pets', value: 'Allowed' },
      ],
      reasons: [
        'Income multiple met (3.2× monthly rent)',
        'Move-in date aligns perfectly',
        'Pets policy matches your needs',
      ],
    },
    {
      id: '2',
      image: property2,
      title: 'Spacious 3-Bed Flat',
      subtitle: 'Camden, London NW1',
      matchPercentage: 62,
      matchCategory: '51-75%',
      details: [
        { label: 'Rent', value: '£2,100/mo' },
        { label: 'Beds', value: '3' },
        { label: 'Available', value: 'Jan 20, 2025' },
        { label: 'Pets', value: 'Allowed' },
      ],
      reasons: [
        'Slightly over budget but pets allowed',
        'Great location near transport',
      ],
    },
    {
      id: '3',
      image: property3,
      title: 'Luxury Loft',
      subtitle: 'Clerkenwell, London EC1',
      matchPercentage: 45,
      matchCategory: '26-50%',
      details: [
        { label: 'Rent', value: '£2,400/mo' },
        { label: 'Beds', value: '2' },
        { label: 'Available', value: 'Mar 1, 2025' },
        { label: 'Pets', value: 'Not allowed' },
      ],
      reasons: [
        'Over budget',
        'Pets not allowed (deal breaker)',
      ],
    },
  ];

  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-3xl font-semibold mb-8 text-center">Daily Picks</h1>
      <SwipeDeck
        cards={mockCards}
        onSwipe={(id, action) => console.log('Swiped', action, 'on', id)}
        onComplete={() => console.log('Deck complete!')}
      />
    </div>
  );
}
