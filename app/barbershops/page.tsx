import Header from "../_components/header";
import SearchInput from "../_components/search-input";
import QuickSearchButtons from "../_components/quick-search-buttons";
import BarbershopItem from "../_components/barbershop-item";
import Footer from "../_components/footer";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "../_components/ui/page";
import { prisma } from "@/lib/prisma";

const BarbershopsPage = async ({
  searchParams,
}: PageProps<"/barbershops/[id]">) => {
  const { search } = await searchParams;

  const barbershops = search
    ? await prisma.barbershop.findMany({
        where: {
          services: {
            some: {
              name: {
                contains: search as string,
                mode: "insensitive",
              },
            },
          },
        },
      })
    : [];

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
        <PageSection>
          <PageSectionTitle>
            {search ? `Resultados para "${search}"` : "Faça uma busca"}
          </PageSectionTitle>
          {barbershops.length > 0 ? (
            <div className="flex flex-col gap-4">
              {barbershops.map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>
          ) : search ? (
            <p className="text-muted-foreground py-8 text-center">
              Nenhuma barbearia encontrada para &quot;{search}&quot;.
            </p>
          ) : null}
        </PageSection>
      </PageContainer>
      <Footer />
    </main>
  );
};

export default BarbershopsPage;
