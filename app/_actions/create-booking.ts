"use server";

import { z } from "zod";
import { actionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { returnValidationErrors } from "next-safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const inputSchema = z.object({
  serviceId: z.string(),
  date: z.date(),
});

export const createBooking = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { serviceId, date } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const service = await prisma.barbershopService.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Service not found"],
      });
    }

    // verifica se já existe agendamento para essa data
    const existingBooking = await prisma.booking.findFirst({
      where: {
        barbershopId: service.barbershopId,
        date,
      },
    });

    if (existingBooking) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Já existe um agendamento para essa data"],
      });
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId,
        date,
        userId: session.user.id,
        barbershopId: service.barbershopId,
      },
    });

    return booking;
  });
