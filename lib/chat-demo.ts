export const chatDemo = {
  businessName: "Exempel: Stadens Trafikskola",
  greeting:
    "Hej! Jag är en demochatt för en fiktiv trafikskola. Fråga mig om lektioner, öppettider eller bokning.",
  suggestions: [
    "Vad kostar en körlektion?",
    "Vilka tider har ni öppet?",
    "Hur bokar jag?",
  ],
  knowledge: [
    {
      keywords: ["pris", "kost", "lektion"],
      answer:
        "I den här demon kostar en körlektion på 50 minuter 720 kr. Trafikskolan erbjuder också exempelpaket – kontakta receptionen för aktuella paketpriser.",
    },
    {
      keywords: ["öppet", "öppettid", "tider"],
      answer:
        "I demoinformationen är receptionen öppen måndag–torsdag 08.00–17.00 och fredag 08.00–15.00.",
    },
    {
      keywords: ["boka", "bokning", "bokar"],
      answer:
        "I exemplet bokar du via trafikskolans elevportal eller genom att ringa receptionen. En riktig chatt kan länka direkt till företagets bokning.",
    },
  ],
  fallback:
    "Det svaret finns inte i min demoinformation. I en riktig lösning hänvisar jag dig vidare till personalen – till exempel via telefon, mejl eller ett kontaktformulär.",
} as const;

export function getDemoAnswer(message: string) {
  const normalized = message.toLocaleLowerCase("sv-SE");
  const match = chatDemo.knowledge.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );
  return match?.answer ?? chatDemo.fallback;
}
