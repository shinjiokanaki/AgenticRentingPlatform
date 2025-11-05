import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar?: string;
  };
  propertyAddress?: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  onSelect?: (id: string) => void;
}

export default function ConversationList({ conversations, onSelect }: ConversationListProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-2" data-testid="list-conversations">
      {conversations.map((conv) => (
        <Card
          key={conv.id}
          className="p-4 cursor-pointer hover-elevate active-elevate-2"
          onClick={() => {
            console.log('Conversation selected:', conv.id);
            onSelect?.(conv.id);
          }}
          data-testid={`conversation-${conv.id}`}
        >
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={conv.participant.avatar} />
              <AvatarFallback>{conv.participant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium truncate">{conv.participant.name}</p>
                <span className="text-xs text-muted-foreground">{formatTime(conv.timestamp)}</span>
              </div>
              {conv.propertyAddress && (
                <p className="text-xs text-muted-foreground mb-1">{conv.propertyAddress}</p>
              )}
              <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
            </div>
            {conv.unread > 0 && (
              <Badge className="h-6">{conv.unread}</Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
