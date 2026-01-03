"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { cn } from "@/lib/utils";
import { CancelBookingSheet } from "./cancel-booking-sheet";
import type {
  Booking,
  BarbershopService,
  Barbershop,
} from "../generated/prisma/client";

interface BookingItemProps {
  booking: Booking & {
    service: BarbershopService;
    barbershop: Barbershop;
  };
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  const now = new Date();
  const isConfirmed = booking.date > now && !booking.cancelled;
  const status = isConfirmed ? "confirmed" : "finished";

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger asChild>
        <Card className="hover:bg-accent flex w-full min-w-full cursor-pointer flex-row items-center justify-between rounded-2xl p-0 transition-colors">
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
              <p className="text-base leading-snug font-bold">
                {booking.service.name}
              </p>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                </Avatar>

                <p className="text-sm leading-snug">
                  {booking.barbershop.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex h-full w-[106px] flex-col items-center justify-center border-l px-0 py-3">
            <p className="text-xs leading-snug capitalize">
              {booking.date.toLocaleDateString("pt-BR", { month: "long" })}
            </p>
            <p className="text-2xl leading-tight">
              {booking.date.toLocaleDateString("pt-BR", { day: "2-digit" })}
            </p>
            <p className="text-xs leading-snug">
              {booking.date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </Card>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-[370px]"
      >
        <SheetTitle className="sr-only">Informações da Reserva</SheetTitle>
        <CancelBookingSheet
          booking={booking}
          onClose={() => setSheetIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
