import { UIMessage } from "ai";
import { ChatMessage } from "./chat-message";

export const UserMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div className="flex flex-col items-end pt-6 pr-5 pl-10">
      <div className="bg-secondary flex h-10 items-center rounded-full px-4">
        <ChatMessage message={message} />
      </div>
    </div>
  );
};
