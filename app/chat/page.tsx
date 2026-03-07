"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef } from "react";
import { AiMessage } from "./_components/ai-message";
import { UserMessage } from "./_components/user-message";
import { WelcomeMessage } from "./_components/welcome-message";
import { ChatHeader } from "./_components/chat-header";
import { ChatStatusBar } from "./_components/chat-status-bar";
import { ChatInputBar } from "./_components/chat-input-bar";

const ChatPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex h-screen flex-col">
      <ChatHeader />
      <ChatStatusBar />

      <section className="flex-1 overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden">
        <WelcomeMessage />
        {messages.map((message, i) =>
          message.role === "assistant" ? (
            <AiMessage
              key={message.id}
              message={message}
              isStreaming={
                status === "streaming" && i === messages.length - 1
              }
            />
          ) : (
            <UserMessage key={message.id} message={message} />
          ),
        )}
        <div ref={messagesEndRef} />
      </section>

      <ChatInputBar onSend={(text) => sendMessage({ text })} />
    </main>
  );
};

export default ChatPage;
