"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "./ui/button";
import { SheetTitle } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import PhoneItem from "./phone-item";
import { cancelBooking } from "../_actions/cancel-booking";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type {
  Booking,
  BarbershopService,
  Barbershop,
} from "../generated/prisma/client";

interface CancelBookingSheetProps {
  booking: Booking & {
    service: BarbershopService;
    barbershop: Barbershop;
  };
  onClose: () => void;
}

export function CancelBookingSheet({
  booking,
  onClose,
}: CancelBookingSheetProps) {
  const { executeAsync, isPending } = useAction(cancelBooking);

  const now = new Date();
  const isConfirmed = booking.date > now && !booking.cancelled;
  const status = isConfirmed ? "confirmed" : "finished";

  const formattedPrice = (booking.service.priceInCents / 100).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );

  const formattedDate = format(booking.date, "dd 'de' MMMM", { locale: ptBR });
  const formattedTime = format(booking.date, "HH:mm");

  const handleCancelBooking = async () => {
    const result = await executeAsync({
      bookingId: booking.id,
    });

    if (result?.validationErrors || result?.serverError) {
      toast.error(
        result.validationErrors?._errors?.[0] || "Erro ao cancelar reserva",
      );
      return;
    }

    toast.success("Reserva cancelada com sucesso!");
    onClose();
  };

  return (
    <div className="flex h-full flex-col gap-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5">
        <SheetTitle className="text-lg font-bold">
          Informações da Reserva
        </SheetTitle>
      </div>

      <Separator />

      {/* Barber Shop Card with Map */}
      <div className="flex flex-col px-5">
        <div className="relative flex h-[180px] items-end justify-center rounded-lg p-5">
          <Image
            src="/map.png"
            alt="Mapa"
            fill
            className="rounded-lg object-cover"
          />
          <Card className="relative z-10 flex w-full items-center gap-3 p-3">
            <Avatar className="size-12">
              <AvatarImage src={booking.barbershop.imageUrl} />
            </Avatar>
            <div className="flex flex-1 flex-col">
              <p className="text-base font-bold">{booking.barbershop.name}</p>
              <p className="text-muted-foreground overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                {booking.barbershop.address}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Status Badge and Booking Details */}
      <div className="flex flex-col gap-3 px-5">
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

        <Card className="flex flex-col gap-3 p-3">
          <div className="flex items-center justify-between font-bold">
            <p className="text-base">{booking.service.name}</p>
            <p className="text-sm">{formattedPrice}</p>
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <p>Data</p>
            <p>{formattedDate}</p>
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <p>Horário</p>
            <p>{formattedTime}</p>
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <p>Barbearia</p>
            <p>{booking.barbershop.name}</p>
          </div>
        </Card>
      </div>

      {/* Contact Info */}
      {booking.barbershop.phones.length > 0 && (
        <div className="flex flex-col gap-3 px-5">
          {booking.barbershop.phones.map((phone) => (
            <PhoneItem key={phone} phone={phone} />
          ))}
        </div>
      )}

      {/* Buttons - Fixed at bottom */}
      <div className="mt-auto flex gap-3 px-5">
        <Button
          variant="outline"
          className="flex-1 rounded-full"
          onClick={onClose}
        >
          Voltar
        </Button>
        <Button
          variant="destructive"
          className="flex-1 rounded-full"
          onClick={handleCancelBooking}
          disabled={!isConfirmed || isPending}
        >
          Cancelar Reserva
        </Button>
      </div>
    </div>
  );
}
