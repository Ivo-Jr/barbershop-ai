import Header from "./_components/header";
import SearchInput from "./_components/search-input";
import Image from "next/image";
import banner from "@/public/banner.png";
import BookingItem from "./_components/booking-item";
import { prisma } from "@/lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import Footer from "./_components/footer";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "./_components/ui/page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import QuickSearchButtons from "./_components/quick-search-buttons";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const recommendedBarbershops = await prisma.barbershop.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const popularBarbershops = await prisma.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  });
  const confirmedBooking = session?.user
    ? await prisma.booking.findFirst({
        where: {
          userId: session.user.id,
          date: {
            gte: new Date(),
          },
          cancelled: false,
        },
        include: {
          service: true,
          barbershop: true,
        },
        orderBy: {
          date: "asc",
        },
      })
    : null;

  return (
    <main>
      <Header />
      <PageContainer>
        <SearchInput />
        <PageSection>
          <PageSectionScroller>
            <QuickSearchButtons />
          </PageSectionScroller>
        </PageSection>
        <Image
          src={banner}
          alt="Banner Barber Shop AI"
          sizes="100vw"
          className="h-auto w-full"
        />
        {confirmedBooking && (
          <PageSection>
            <PageSectionTitle>Agendamentos</PageSectionTitle>
            <BookingItem booking={confirmedBooking} />
          </PageSection>
        )}
        <PageSection>
          <PageSectionTitle>Recomendados</PageSectionTitle>
          <PageSectionScroller>
            {recommendedBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSection>
        <PageSection>
          <PageSectionTitle>Populares</PageSectionTitle>
          <PageSectionScroller>
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </PageSectionScroller>
        </PageSection>
      </PageContainer>
      <Footer />
    </main>
  );
}
8;
