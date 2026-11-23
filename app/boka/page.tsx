import type { Metadata } from "next";
import { Check } from "lucide-react";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = { title: "Boka möte", description: "Boka ett första 30-minutersmöte med Sandside UF." };

export default function BookingPage() {
  return (
    <section className="section booking-page">
      <div className="container booking-layout">
        <div className="booking-intro"><p className="eyebrow">Boka ett första möte</p><h1>Berätta vad era kunder brukar fråga om.</h1><p>Under 30 minuter går vi igenom er verksamhet, vanliga frågor och vad en chattbot skulle kunna ta hand om. Samtalet är kostnadsfritt och ni förbinder er inte till något.</p><ul className="check-list"><li><Check aria-hidden="true" /> 30 minuter</li><li><Check aria-hidden="true" /> Inga tekniska förkunskaper behövs</li><li><Check aria-hidden="true" /> Ett konkret nästa steg efter mötet</li></ul></div>
        <BookingFlow />
      </div>
    </section>
  );
}
