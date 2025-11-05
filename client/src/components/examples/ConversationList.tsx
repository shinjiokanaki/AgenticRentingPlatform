import ConversationList from '../ConversationList';

export default function ConversationListExample() {
  const mockConversations = [
    {
      id: '1',
      participant: { name: 'Sarah Wilson' },
      propertyAddress: 'Shoreditch, London E1',
      lastMessage: 'The viewing is confirmed for tomorrow at 2pm',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: 2,
    },
    {
      id: '2',
      participant: { name: 'John Smith' },
      propertyAddress: 'Camden, London NW1',
      lastMessage: 'I can provide the references you requested',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: 0,
    },
  ];

  return (
    <div className="max-w-md">
      <ConversationList
        conversations={mockConversations}
        onSelect={(id) => console.log('Selected:', id)}
      />
    </div>
  );
}
