import ChatInterface from '../ChatInterface';

export default function ChatInterfaceExample() {
  const mockMessages = [
    { id: '1', sender: 'other' as const, text: 'Hi, I saw your application for the property in Shoreditch', timestamp: new Date(Date.now() - 60 * 60 * 1000) },
    { id: '2', sender: 'me' as const, text: 'Yes, I\'m very interested! When can I schedule a viewing?', timestamp: new Date(Date.now() - 50 * 60 * 1000) },
    { id: '3', sender: 'system' as const, text: 'Viewing booked for Jan 15, 2025 at 2:00 PM', timestamp: new Date(Date.now() - 40 * 60 * 1000) },
  ];

  return (
    <div className="max-w-2xl">
      <ChatInterface
        messages={mockMessages}
        participantName="Sarah Wilson"
        onSend={(text) => console.log('Send:', text)}
      />
    </div>
  );
}
