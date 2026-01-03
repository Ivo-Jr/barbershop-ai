"use server";

import { z } from "zod";
import { actionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { returnValidationErrors } from "next-safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const inputSchema = z.object({
  bookingId: z.string(),
});

export const cancelBooking = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { bookingId } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Reserva não encontrada"],
      });
    }

    if (booking.userId !== session.user.id) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Você não tem permissão para cancelar esta reserva"],
      });
    }

    if (booking.cancelled) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Esta reserva já foi cancelada"],
      });
    }

    // Verifica se a reserva está no passado
    const now = new Date();
    if (booking.date <= now) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Não é possível cancelar reservas finalizadas"],
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        cancelled: true,
        cancelledAt: new Date(),
      },
    });

    revalidatePath("/bookings");

    return updatedBooking;
  });
