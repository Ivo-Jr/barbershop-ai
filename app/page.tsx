import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import Image from "next/image";
import banner from "@/public/banner.png";
import BookingItem from "./_components/booking-item";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="space-y-4 px-5">
        <SearchInput />
        <Image
          src={banner}
          alt="Banner Barber Shop AI"
          sizes="100vw"
          className="h-auto w-full"
        />
        <h2 className="text-foreground text-xs font-semibold uppercase">
          Agendamentos
        </h2>
        <BookingItem
          serviceName="Corte de Cabelo"
          barberShopName="Barbearia do João"
          barberShopImageUrl="https://utfs.io/f/7e309eaa-d722-465b-b8b6-76217404a3d3-16s.png"
          date={new Date()}
        />
      </div>
    </main>
  );
}
