import { NextResponse } from "next/server";
import { bookingSchema, createBooking, isSlotUnavailable } from "@/lib/booking";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "Kontrollera uppgifterna och försök igen.", fields: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const booking = await createBooking(parsed.data);
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    if (isSlotUnavailable(error)) {
      return NextResponse.json(
        { code: "SLOT_UNAVAILABLE", message: "Tiden är inte längre ledig. Välj en annan tid." },
        { status: 409 },
      );
    }
    if (error instanceof Error && error.message === "DATABASE_NOT_CONFIGURED") {
      return NextResponse.json(
        { code: "NOT_CONFIGURED", message: "Bokningsdatabasen är inte ansluten ännu." },
        { status: 503 },
      );
    }
    console.error("Booking error", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "Bokningen kunde inte sparas. Försök igen." },
      { status: 500 },
    );
  }
}
