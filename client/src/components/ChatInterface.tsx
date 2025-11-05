import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";

export interface Message {
  id: string;
  sender: "me" | "other" | "system";
  text: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  participantName: string;
  participantAvatar?: string;
  onSend?: (text: string) => void;
}

export default function ChatInterface({ messages, participantName, participantAvatar, onSend }: ChatInterfaceProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      console.log('Message sent:', input);
      onSend?.(input);
      setInput("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="flex flex-col h-[600px]" data-testid="card-chat">
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage src={participantAvatar} />
          <AvatarFallback>{participantName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{participantName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"}`}
            data-testid={`message-${msg.id}`}
          >
            {msg.sender === "system" ? (
              <Card className="p-2 px-4 bg-muted max-w-md">
                <p className="text-xs text-center text-muted-foreground">{msg.text}</p>
              </Card>
            ) : (
              <div className={`flex gap-2 max-w-md ${msg.sender === "me" ? "flex-row-reverse" : ""}`}>
                {msg.sender === "other" && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={participantAvatar} />
                    <AvatarFallback>{participantName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <Card className={`p-3 ${msg.sender === "me" ? "bg-primary text-primary-foreground" : ""}`}>
                    <p className="text-sm">{msg.text}</p>
                  </Card>
                  <p className={`text-xs text-muted-foreground mt-1 ${msg.sender === "me" ? "text-right" : ""}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            data-testid="input-message"
          />
          <Button onClick={handleSend} size="icon" data-testid="button-send">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
