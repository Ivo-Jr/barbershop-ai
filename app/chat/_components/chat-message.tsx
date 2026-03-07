"use client";

import { UIMessage } from "ai";
import { Streamdown } from "streamdown";

interface ChatMessageProps {
  message: UIMessage;
  isStreaming?: boolean;
}

export const ChatMessage = ({ message, isStreaming }: ChatMessageProps) => {
  return (
    <div className="text-foreground text-sm leading-[1.4]">
      {message.parts.map((part, i) =>
        part.type === "text" ? (
          <Streamdown
            key={`${message.id}-${i}`}
            isAnimating={isStreaming && message.role === "assistant"}
          >
            {part.text}
          </Streamdown>
        ) : null,
      )}
    </div>
  );
};
