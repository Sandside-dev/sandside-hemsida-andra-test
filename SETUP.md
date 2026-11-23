# Sandside UF – start, konfiguration och drift

## Starta lokalt

Krav: Node.js 20.9 eller senare och npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Öppna http://localhost:3000. Startsidan och chattdemon fungerar utan miljövariabler. Bokningssidan visar ett tydligt konfigurationsbesked tills Postgres är anslutet.

## Aktivera bokningar med Supabase

1. Skapa ett Supabase-projekt.
2. Kör `supabase/migrations/001_bookings.sql` i Supabase SQL Editor.
3. Hämta den poolade Postgres-anslutningen (port 6543) och lägg den som `DATABASE_URL` i `.env.local` och i Vercel.
4. Starta om utvecklingsservern.

Servern genererar endast tider som följer `lib/booking-config.ts`, kontrollerar att tiden ligger i framtiden och är erbjuden samt sparar bokningen i en transaktion. `bookings.starts_at` är primärnyckel, vilket stoppar samtidiga dubbelbokningar på databasnivå.

### Se bokningar och blockera tider

Se bokningar i Supabase Table Editor (`bookings`) eller kör:

```sql
select starts_at, name, company, email, needs, email_status, created_at
from public.bookings
order by starts_at;
```

Blockera en enskild starttid (lagra alltid med tidszon):

```sql
insert into public.blocked_slots (starts_at, reason)
values ('2026-12-01 16:00:00+01', 'Ej tillgänglig');
```

Blockera en hel dag enligt svensk lokal tid:

```sql
insert into public.blocked_dates (blocked_date, reason)
values ('2026-12-24', 'Julafton');
```

## Aktivera bokningsmejl med Resend

Lägg in `RESEND_API_KEY`, `BOOKING_FROM_EMAIL` och `BOOKING_NOTIFY_EMAIL`. Avsändardomänen måste vara verifierad hos Resend. Bokningen sparas först; om mejlet misslyckas ligger bokningen kvar och `email_status` blir `failed`. Utan mejlkonfiguration blir status `not_configured`.

## Ändra innehåll

- Teamnamn, roller, texter, porträtt och Pexels-källor: `lib/team.ts`
- Porträttfiler: `public/images/team/` (800 × 1000 WebP rekommenderas)
- Dokumenterade bildkällor: `docs/PEXELS-SOURCES.md`
- Demofrågor och lokala svar: `lib/chat-demo.ts`
- Möteslängd, öppettider, framförhållning och bokningsperiod: `lib/booking-config.ts`
- Designbeslut: `docs/DESIGN-SYSTEM.md`

## Kvalitetskontroller

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Driftsätt på Vercel

Importera Git-repot i Vercel, behåll standardinställningarna för Next.js och lägg in miljövariablerna från `.env.example`. Sätt `NEXT_PUBLIC_SITE_URL` till den slutliga HTTPS-adressen. Kör databasmigrationen innan bokningsfunktionen öppnas för besökare.
