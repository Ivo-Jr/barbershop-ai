import { createBooking } from "@/app/_actions/create-booking";
import { getDateAvailableTimeSlots } from "@/app/_actions/get-date-available-time-slots";
import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import { z } from "zod";

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(10),
    system: `Você é o Aparatus AI, um assistente virtual de agendamento de barbearias
      
      DATA ATUAL: Hoje é ${new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })} (${new Date().toISOString().split("T")[0]})

      Seu objetivo é ajudar os usuários a:
      - Encontrar barbearias (por nome ou todas disponíveis)
      - Verificar disponibilidade de horários para barbearias específicas
      - Fornecer informações sobre serviços e preços


      Fluxo de atendimento:
      CENÁRIO 1 - Usuário menciona data/horário na primeira mensagem (ex: "quero um corte pra hoje", "preciso cortar o cabelo amanhã", "quero marcar para sexta"):
      1. Use a ferramenta searchBarbershops para buscar barbearias
      2. IMEDIATAMENTE após receber as barbearias, use a ferramenta getAvailableTimeSlotsForBarbershop para CADA barbearia retornada, passando a data mencionada pelo usuário
      3. Apresente APENAS as barbearias que têm horários disponíveis, mostrando:
        - Nome da barbearia
        - Endereço
        - Serviços oferecidos com preços
        - Alguns horários disponíveis (7-8 opções espaçadas)
      4. Quando o usuário escolher, forneça o resumo final

      CENÁRIO 2 - Usuário não menciona data/horário inicialmente:
      1. Use a ferramenta searchBarbershops para buscar barbearias
      2. Apresente as barbearias encontradas com:
        - Nome da barbearia
        - Endereço
        - Serviços oferecidos com preços
      3. Quando o usuário demonstrar interesse em uma barbearia específica ou mencionar uma data, pergunte a data desejada (se ainda não foi informada)
      4. Use a ferramenta getAvailableTimeSlotsForBarbershop passando o barbershopId e a data
      5. Apresente os horários disponíveis (liste alguns horários, não todos - sugira 7-8 opções espaçadas)


      Resumo final (quando o usuário escolher):
      - Nome da barbearia
      - Endereço
      - Serviço escolhido
      - Data e horário escolhido
      - Preço

      Importante:
      - NUNCA mostre informações técnicas ao usuário (barbershopId, serviceId, formatos ISO de data, etc.)
      - Sempre retorne um texto para o usuário. NUNCA um JSON.
      - Seja sempre educado, prestativo e use uma linguagem informal e amigável
      - Não liste TODOS os horários disponíveis, sugira apenas 4-5 opções espaçadas ao longo do dia
      - Se não houver horários disponíveis, sugira uma data alternativa
      - Quando o usuário mencionar "hoje", "amanhã", "depois de amanhã" ou dias da semana, calcule a data correta automaticamente
      `,
    tools: {
      searchBarbershops: tool({
        description:
          "Pesquisa de barbearias pelo nome. Se nenhum nome for fornecido, retorne todas as barbearias.",
        inputSchema: z.object({
          name: z.string().optional().describe("O nome opcional da barbearia."),
        }),
        execute: async ({ name }) => {
          if (!name?.trim()) {
            const barbershops = await prisma.barbershop.findMany({
              include: {
                services: true,
              },
            });
            return barbershops.map((barbershop) => ({
              name: barbershop.name,
              address: barbershop.address,
              services: barbershop.services.map((service) => ({
                id: service.id,
                name: service.name,
                price: service.priceInCents / 100,
              })),
            }));
          }
          const barbershops = await prisma.barbershop.findMany({
            where: {
              name: {
                contains: name,
                mode: "insensitive",
              },
            },
            include: {
              services: true,
            },
          });
          return barbershops.map((barbershop) => ({
            id: barbershop.id,
            name: barbershop.name,
            address: barbershop.address,
            services: barbershop.services.map((service) => ({
              id: service.id,
              name: service.name,
              price: service.priceInCents / 100,
            })),
          }));
        },
      }),
      getAvailableTimeSlotsBarbershop: tool({
        description:
          "Obtém os horários disponíveis para um barbearia em uma data específica.",
        inputSchema: z.object({
          barbershopId: z.string().describe("O ID da barbearia."),
          date: z.string().describe("A data em formato YYYY-MM-DD."),
        }),
        execute: async ({ barbershopId, date }) => {
          const result = await getDateAvailableTimeSlots({
            barbershopId,
            date: new Date(date),
          });
          if (result.serverError || result.validationErrors) {
            return {
              error: result.validationErrors?._errors?.[0],
            };
          }

          return {
            barbershopId,
            date,
            availableTimeSlots: result.data,
          };
        },
      }),
      createBooking: tool({
        description:
          "Cria um agendamento para um serviço numa data e horario específicos.",
        inputSchema: z.object({
          serviceId: z.string().describe("O ID do serviço."),
          date: z.string().describe("A data em formato YYYY-MM-DD."),
        }),
        execute: async ({ serviceId, date }) => {
          const result = await createBooking({
            serviceId,
            date: new Date(date),
          });
          if (result.serverError || result.validationErrors) {
            return {
              error:
                result.validationErrors?._errors?.[0] ||
                "Erro ao criar agendamento.",
            };
          }
          return {
            success: true,
            message: "Agendamento criado com sucesso.",
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
};
