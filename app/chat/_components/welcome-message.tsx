import { Bot } from "lucide-react";

export const WelcomeMessage = () => {
  return (
    <div className="flex items-start gap-2 pt-6 pr-14 pl-3">
      <div className="border-border bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full border">
        <Bot className="text-primary size-3.5" />
      </div>
      <div className="text-foreground text-sm leading-[1.4]">
        <p>
          Olá! Sou o{" "}
          <span className="font-serif tracking-tight italic">Aparatus</span>,
          seu assistente pessoal.
        </p>
        <p className="mt-[1.4em]">
          Estou aqui para te auxiliar a agendar seu corte ou barba, encontrar as
          barbearias disponíveis perto de você e responder às suas dúvidas.
        </p>
      </div>
    </div>
  );
};
