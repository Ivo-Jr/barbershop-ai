import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface BookingItemProps {
  serviceName: string;
  barberShopName: string;
  barberShopImageUrl: string;
  date: Date;
  status?: "confirmed" | "finished";
}

const BookingItem = ({
  serviceName,
  barberShopName,
  barberShopImageUrl,
  date,
  status = "confirmed",
}: BookingItemProps) => {
  const isConfirmed = status === "confirmed";

  return (
    <Card className="flex w-full min-w-full flex-row items-center justify-between rounded-2xl p-0">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Badge
          className={cn(
            "w-fit rounded-full border-transparent px-2 py-1.5 text-xs leading-none font-semibold tracking-tighter uppercase",
            isConfirmed
              ? "bg-primary/10 text-primary"
              : "bg-muted-foreground/10 text-muted-foreground",
          )}
        >
          {isConfirmed ? "Confirmado" : "Finalizado"}
        </Badge>

        <div className="flex flex-col gap-2.5">
          <p className="text-base leading-snug font-bold">{serviceName}</p>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={barberShopImageUrl} />
            </Avatar>

            <p className="text-sm leading-snug">{barberShopName}</p>
          </div>
        </div>
      </div>

      <div className="flex h-full w-[106px] flex-col items-center justify-center border-l px-0 py-3">
        <p className="text-xs leading-snug capitalize">
          {date.toLocaleDateString("pt-BR", { month: "long" })}
        </p>
        <p className="text-2xl leading-tight">
          {date.toLocaleDateString("pt-BR", { day: "2-digit" })}
        </p>
        <p className="text-xs leading-snug">
          {date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </Card>
  );
};

export default BookingItem;
