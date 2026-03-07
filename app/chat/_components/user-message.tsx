import { UIMessage } from "ai";
import { ChatMessage } from "./chat-message";

export const UserMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div className="flex flex-col items-end pt-6 pr-5 pl-10">
      <div className="bg-secondary max-w-[350px] rounded-2xl px-4 py-2.5 break-all">
        <ChatMessage message={message} />
      </div>
    </div>
  );
};
