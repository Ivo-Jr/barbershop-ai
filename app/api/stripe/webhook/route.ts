import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const date = session.metadata?.data;
    const serviceId = session.metadata?.serviceId;
    const barbershopId = session.metadata?.barbershopId;
    const userId = session.metadata?.userId;

    if (!date || !serviceId || !barbershopId || !userId) {
      return NextResponse.error();
    }

    await prisma.booking.create({
      data: {
        date: new Date(date),
        serviceId,
        barbershopId,
        userId,
      },
    });
  }

  revalidatePath(`/bookings`);
  return NextResponse.json({ received: true });
}
