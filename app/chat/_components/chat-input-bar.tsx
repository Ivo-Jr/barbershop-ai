import { Button } from "@/app/_components/ui/button";
import { useChatInput } from "@/app/hook/useChatInput";
import { Mic, Send } from "lucide-react";

interface ChatInputBarProps {
  onSend: (text: string) => void;
}

export const ChatInputBar = ({ onSend }: ChatInputBarProps) => {
  const { input, setInput, handleKeyDown, handleSend } = useChatInput(onSend);

  return (
    <footer className="bg-muted shrink-0 p-5">
      <div className="flex items-stretch gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem"
          className="bg-background text-foreground placeholder:text-muted-foreground flex-1 rounded-full px-4 py-3 text-sm focus:outline-none"
        />
        <Button type="button" size="icon" className="size-[42px] rounded-full">
          <Mic className="size-5" />
        </Button>
        <Button
          type="button"
          onClick={handleSend}
          size="icon"
          className="size-[42px] rounded-full"
        >
          <Send className="size-5" />
        </Button>
      </div>
    </footer>
  );
};
