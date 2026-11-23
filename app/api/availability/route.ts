import { NextResponse } from "next/server";
import { bookingConfig } from "@/lib/booking-config";
import { getAvailableSlots } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const availability = await getAvailableSlots();
    return NextResponse.json({
      ...availability,
      timezone: bookingConfig.timezone,
      durationMinutes: bookingConfig.durationMinutes,
      message:
        availability.status === "not_configured"
          ? "Bokningsdatabasen är inte ansluten ännu. Följ installationsstegen för att aktivera lediga tider."
          : undefined,
    });
  } catch (error) {
    console.error("Availability error", error);
    return NextResponse.json(
      { status: "error", slots: [], message: "Lediga tider kunde inte hämtas just nu. Försök igen senare." },
      { status: 503 },
    );
  }
}
