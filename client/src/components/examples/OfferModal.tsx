import { useState } from 'react';
import OfferModal from '../OfferModal';
import { Button } from '@/components/ui/button';

export default function OfferModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Make an Offer</Button>
      <OfferModal
        open={open}
        onOpenChange={setOpen}
        propertyPrice={1850}
        onSubmit={(offer) => console.log('Offer:', offer)}
      />
    </div>
  );
}
