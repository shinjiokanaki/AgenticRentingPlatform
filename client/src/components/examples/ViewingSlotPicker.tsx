import ViewingSlotPicker from '../ViewingSlotPicker';

export default function ViewingSlotPickerExample() {
  const mockSlots = [
    { id: '1', start: new Date('2025-01-15T10:00:00'), end: new Date('2025-01-15T10:30:00'), available: true },
    { id: '2', start: new Date('2025-01-15T14:00:00'), end: new Date('2025-01-15T14:30:00'), available: true },
    { id: '3', start: new Date('2025-01-16T11:00:00'), end: new Date('2025-01-16T11:30:00'), available: false },
  ];

  return (
    <div className="max-w-2xl">
      <ViewingSlotPicker
        slots={mockSlots}
        onBook={(id) => console.log('Booked slot:', id)}
      />
    </div>
  );
}
