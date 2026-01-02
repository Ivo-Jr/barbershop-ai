import Header from "../_components/header";
import Footer from "../_components/footer";
import {
  PageContainer,
  PageSection,
  PageSectionTitle,
} from "../_components/ui/page";
import BookingItem from "../_components/booking-item";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function BookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <main>
        <Header />
        <PageContainer>
          <h1 className="text-xl font-bold">Agendamentos</h1>
          <p className="text-muted-foreground">
            Você precisa estar logado para ver seus agendamentos.
          </p>
        </PageContainer>
        <Footer />
      </main>
    );
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      service: true,
      barbershop: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const now = new Date();

  const confirmedBookings = bookings.filter(
    (booking) => booking.date > now && !booking.cancelled,
  );

  const finishedBookings = bookings.filter(
    (booking) => booking.date <= now || booking.cancelled,
  );

  return (
    <main>
      <Header />
      <PageContainer>
        <h1 className="text-xl font-bold">Agendamentos</h1>

        {confirmedBookings.length > 0 && (
          <PageSection>
            <PageSectionTitle>Confirmados</PageSectionTitle>
            <div className="space-y-3">
              {confirmedBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  serviceName={booking.service.name}
                  barberShopName={booking.barbershop.name}
                  barberShopImageUrl={booking.barbershop.imageUrl}
                  date={booking.date}
                  status="confirmed"
                />
              ))}
            </div>
          </PageSection>
        )}

        {finishedBookings.length > 0 && (
          <PageSection>
            <PageSectionTitle>Finalizados</PageSectionTitle>
            <div className="space-y-3">
              {finishedBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  serviceName={booking.service.name}
                  barberShopName={booking.barbershop.name}
                  barberShopImageUrl={booking.barbershop.imageUrl}
                  date={booking.date}
                  status="finished"
                />
              ))}
            </div>
          </PageSection>
        )}

        {confirmedBookings.length === 0 && finishedBookings.length === 0 && (
          <p className="text-muted-foreground">
            Você ainda não tem agendamentos.
          </p>
        )}
      </PageContainer>
      <Footer />
    </main>
  );
}
