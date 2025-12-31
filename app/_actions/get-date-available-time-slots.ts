"use server";

import { actionClient } from "@/lib/action-client";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots } from "@/lib/utils";
import { endOfDay, format, startOfDay } from "date-fns";
import { z } from "zod";

const inputSchema = z.object({
  barbershopId: z.string(),
  date: z.date(),
});

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barbershopId, date } }) => {
    const bookings = await prisma.booking.findMany({
      where: {
        barbershopId,
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
    });

    const occupiedTimeSlots = bookings.map((booking) =>
      format(booking.date, "HH:mm"),
    );

    const availableTimeSlots = generateTimeSlots().filter(
      (slot) => !occupiedTimeSlots.includes(slot),
    );

    return availableTimeSlots;
  });
