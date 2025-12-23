import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Separator } from "@/app/_components/ui/separator";
import Footer from "@/app/_components/footer";
import { PageSectionTitle } from "@/app/_components/ui/page";
import ServiceItem from "@/app/_components/service-item";
import PhoneItem from "@/app/_components/phone-item";

const BarbershopPage = async (props: PageProps<"/barbershops/[id]">) => {
  const { id } = await props.params;

  const barbershop = await prisma.barbershop.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    notFound();
  }

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[297px] w-full">
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-6 left-5">
          <Button
            variant="outline"
            size="icon"
            className="bg-background rounded-full"
            asChild
          >
            <Link href="/">
              <ChevronLeft />
            </Link>
          </Button>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-background relative -mt-6 rounded-tl-3xl rounded-tr-3xl">
        {/* Barbershop Info Section */}
        <div className="flex items-center gap-1.5 px-5 pt-6">
          <div className="relative h-[30px] w-[30px] shrink-0">
            <Image
              src={barbershop.imageUrl}
              alt={barbershop.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-foreground text-xl font-bold">
            {barbershop.name}
          </h1>
        </div>
        <p className="text-muted-foreground mt-1 px-5 text-sm">
          {barbershop.address}
        </p>

        {/* About Section */}
        <div className="py-6">
          <Separator />
        </div>
        <div className="space-y-3 px-5">
          <PageSectionTitle>Sobre Nós</PageSectionTitle>
          <p className="text-foreground text-sm leading-[1.4]">
            {barbershop.description}
          </p>
        </div>
        <div className="py-6">
          <Separator />
        </div>

        {/* Services Section */}
        <div className="space-y-3 px-5">
          <PageSectionTitle>Serviços</PageSectionTitle>
          <div className="space-y-3">
            {barbershop.services.map((service) => (
              <ServiceItem
                key={service.id}
                service={service}
                barbershop={barbershop}
              />
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-6">
          <Separator />
        </div>
        <div className="space-y-3 px-5">
          <PageSectionTitle>Contato</PageSectionTitle>
          <div className="space-y-3">
            {barbershop.phones.map((phone, index) => (
              <PhoneItem key={index} phone={phone} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-[60px]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default BarbershopPage;
