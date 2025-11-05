import { useState } from "react";
import ConversationList from "@/components/ConversationList";
import ChatInterface from "@/components/ChatInterface";
import { Card } from "@/components/ui/card";

export default function MessagesPage() {
  const [selectedConv, setSelectedConv] = useState<string | null>('1');

  const conversations = [
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

  const messages = [
    { id: '1', sender: 'other' as const, text: 'Hi, I saw your application for the property in Shoreditch', timestamp: new Date(Date.now() - 60 * 60 * 1000) },
    { id: '2', sender: 'me' as const, text: 'Yes, I\'m very interested! When can I schedule a viewing?', timestamp: new Date(Date.now() - 50 * 60 * 1000) },
    { id: '3', sender: 'system' as const, text: 'Viewing booked for Jan 15, 2025 at 2:00 PM', timestamp: new Date(Date.now() - 40 * 60 * 1000) },
    { id: '4', sender: 'other' as const, text: 'Perfect! See you then. Please bring a form of ID.', timestamp: new Date(Date.now() - 30 * 60 * 1000) },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-8">Messages</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ConversationList
              conversations={conversations}
              onSelect={(id) => setSelectedConv(id)}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedConv ? (
              <ChatInterface
                messages={messages}
                participantName="Sarah Wilson"
                onSend={(text) => console.log('Send:', text)}
              />
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
