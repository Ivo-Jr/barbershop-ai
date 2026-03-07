import { Bot } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { UIMessage } from "ai";

interface AiMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export const AiMessage = ({ message, isStreaming }: AiMessageProps) => {
  return (
    <div className="flex items-start gap-2 pt-6 pr-14 pl-3">
      <div className="border-border bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full border">
        <Bot className="text-primary size-3.5" />
      </div>
      <ChatMessage message={message} isStreaming={isStreaming} />
    </div>
  );
};
