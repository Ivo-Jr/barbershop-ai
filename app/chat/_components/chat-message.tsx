import { UIMessage } from "ai";

export const ChatMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div className="text-foreground text-sm leading-[1.4]">
      {message.parts.map((part, i) =>
        part.type === "text" ? <span key={i}>{part.text}</span> : null,
      )}
    </div>
  );
};
