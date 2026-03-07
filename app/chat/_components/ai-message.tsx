import { Bot } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { UIMessage } from "ai";

export const AiMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div className="flex items-start gap-2 pt-6 pr-14 pl-3">
      <div className="border-border bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full border">
        <Bot className="text-primary size-3.5" />
      </div>
      <ChatMessage message={message} />
    </div>
  );
};
