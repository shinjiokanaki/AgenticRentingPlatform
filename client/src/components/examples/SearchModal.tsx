import { useState } from 'react';
import SearchModal from '../SearchModal';
import { Button } from '@/components/ui/button';

export default function SearchModalExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Search Modal</Button>
      <SearchModal 
        open={open} 
        onOpenChange={setOpen}
        onSearch={(query) => console.log('Search:', query)}
      />
    </div>
  );
}
