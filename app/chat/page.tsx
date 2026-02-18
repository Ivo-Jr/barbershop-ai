"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { Bot, ChevronLeft, Mic, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../_components/ui/button";

const AiMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div className="flex items-start gap-2 pt-6 pr-14 pl-3">
      <div className="border-border bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full border">
        <Bot className="text-primary size-3.5" />
      </div>
      <div className="text-foreground text-sm leading-[1.4]">
        {message.parts.map((part, i) =>
          part.type === "text" ? <p key={i}>{part.text}</p> : null,
        )}
      </div>
    </div>
  );
};

const UserMessage = ({ message }: { message: UIMessage }) => {
  return (
    <div className="flex flex-col items-end pt-6 pr-5 pl-10">
      <div className="bg-secondary flex h-10 items-center rounded-full px-4">
        <p className="text-foreground text-sm leading-[1.4]">
          {message.parts.map((part, i) =>
            part.type === "text" ? <span key={i}>{part.text}</span> : null,
          )}
        </p>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-5 pt-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="size-4" />
        </Button>
        <p className="text-foreground font-serif text-xl tracking-tight italic">
          Aparatus
        </p>
        <div className="size-6" />
      </div>

      {/* Status bar */}
      <div className="shrink-0 px-5 pt-6">
        <div className="border-border rounded-xl border p-3">
          <p className="text-muted-foreground text-center text-sm leading-[1.4]">
            Seu assistente de agendamentos está online.
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden">
        {/* Welcome message */}
        <div className="flex items-start gap-2 pt-6 pr-14 pl-3">
          <div className="border-border bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full border">
            <Bot className="text-primary size-3.5" />
          </div>
          <div className="text-foreground text-sm leading-[1.4]">
            <p>
              Olá! Sou o{" "}
              <span className="font-serif tracking-tight italic">Aparatus</span>
              , seu assistente pessoal.
            </p>
            <p className="mt-[1.4em]">
              Estou aqui para te auxiliar a agendar seu corte ou barba,
              encontrar as barbearias disponíveis perto de você e responder às
              suas dúvidas.
            </p>
          </div>
        </div>

        {messages.map((message) =>
          message.role === "assistant" ? (
            <AiMessage key={message.id} message={message} />
          ) : (
            <UserMessage key={message.id} message={message} />
          ),
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="bg-muted shrink-0 p-5">
        <div className="flex items-stretch gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem"
            className="bg-background text-foreground placeholder:text-muted-foreground flex-1 rounded-full px-4 py-3 text-sm focus:outline-none"
          />
          <button
            type="button"
            className="bg-primary text-primary-foreground flex w-[42px] items-center justify-center rounded-full p-2.5"
          >
            <Mic className="size-5" />
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="bg-primary text-primary-foreground flex w-[42px] items-center justify-center rounded-full p-2.5"
          >
            <Send className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
