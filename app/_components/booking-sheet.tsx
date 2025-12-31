"use client";

import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { SheetTitle } from "./ui/sheet";
import { Barbershop, BarbershopService } from "../generated/prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createBooking } from "../_actions/create-booking";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface BookingSheetProps {
  service: BarbershopService;
  barbershop: Barbershop;
  onClose: () => void;
}

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 9; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 18) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

export function BookingSheet({
  service,
  barbershop,
  onClose,
}: BookingSheetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  const { executeAsync, isPending } = useAction(createBooking);

  const timeSlots = generateTimeSlots();

  const formattedPrice = (service.priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const formattedDate = selectedDate
    ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
    : "";

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
    const timeSplitted = selectedTime.split(":");
    const hours = timeSplitted[0];
    const minutes = timeSplitted[1];
    const date = new Date(selectedDate);
    date.setHours(Number(hours), Number(minutes));

    const result = await executeAsync({
      serviceId: service.id,
      date,
    });

    if (result?.validationErrors || result?.serverError) {
      toast.error(result.validationErrors?._errors?.[0]);
      return;
    }

    toast.success("Agendamento criado com sucesso!");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    onClose();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-6">
        <SheetTitle className="text-lg font-bold">Fazer Reserva</SheetTitle>
      </div>

      <Separator />

      {/* Calendar */}
      <div className="flex flex-col items-center px-5 py-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          locale={ptBR}
          className="w-full"
        />
      </div>

      {selectedDate && (
        <>
          <Separator />

          {/* Time Slots */}
          <div className="flex gap-3 overflow-x-auto px-5 py-6 [&::-webkit-scrollbar]:hidden">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className="min-w-fit rounded-full"
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </>
      )}

      {selectedDate && selectedTime && (
        <>
          <Separator />

          {/* Summary Card */}
          <div className="flex flex-col items-center px-5 py-6">
            <div className="bg-card border-border flex w-full flex-col gap-3 rounded-lg border p-3">
              <div className="flex items-center justify-between font-bold">
                <p className="text-base">{service.name}</p>
                <p className="text-sm">{formattedPrice}</p>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <p>Data</p>
                <p>{formattedDate}</p>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <p>Horário</p>
                <p>{selectedTime}</p>
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <p>Barbearia</p>
                <p>{barbershop.name}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirm Button - Fixed at bottom */}
      <div className="mt-auto flex flex-col px-5 py-6">
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime || isPending}
          className="w-full rounded-full"
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
