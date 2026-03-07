import { Button } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const ChatHeader = () => {
  const router = useRouter();
  return (
    <header className="flex shrink-0 items-center justify-between px-5 pt-6">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ChevronLeft className="size-4" />
      </Button>
      <p className="text-foreground font-serif text-xl tracking-tight italic">
        Aparatus
      </p>
      <div className="size-6" />
    </header>
  );
};
