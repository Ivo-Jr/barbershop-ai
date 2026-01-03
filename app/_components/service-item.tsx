"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Barbershop, BarbershopService } from "../generated/prisma/client";
import { BookingSheet } from "./booking-sheet";

interface ServiceItemProps {
  service: BarbershopService;
  barbershop: Barbershop;
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);

  const formattedPrice = (service.priceInCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="bg-muted border-border flex items-center gap-3 rounded-2xl border p-3">
      <div className="relative h-[110px] w-[110px] shrink-0">
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          className="rounded-[10px] object-cover"
        />
      </div>
      <div className="flex h-[110px] flex-1 flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-card-foreground text-sm font-bold">
            {service.name}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-[1.4]">
            {service.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-card-foreground text-sm font-bold">
            {formattedPrice}
          </p>
          <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
            <SheetTrigger asChild>
              <Button className="h-auto rounded-full px-4 py-2 text-sm">
                Reservar
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-min-[370px] overflow-y-auto p-0"
            >
              <SheetTitle className="sr-only">Fazer Reserva</SheetTitle>
              <BookingSheet
                service={service}
                barbershop={barbershop}
                onClose={() => setSheetIsOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
