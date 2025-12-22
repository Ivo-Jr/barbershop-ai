import Image from "next/image";
import { Button } from "./ui/button";
import { BarbershopService } from "../generated/prisma/client";

interface ServiceItemProps {
  service: BarbershopService;
}

const ServiceItem = ({ service }: ServiceItemProps) => {
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
          <Button className="h-auto rounded-full px-4 py-2 text-sm">
            Reservar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
