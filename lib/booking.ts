import { DateTime } from "luxon";
import postgres from "postgres";
import { Resend } from "resend";
import { z } from "zod";
import { bookingConfig } from "@/lib/booking-config";

export const bookingSchema = z.object({
  startsAt: z.string().datetime({ offset: true }),
  name: z.string().trim().min(2, "Fyll i ditt namn.").max(100),
  company: z.string().trim().min(2, "Fyll i företagets namn.").max(120),
  email: z.string().trim().email("Fyll i en giltig mejladress.").max(200),
  needs: z.string().trim().max(1200).optional().default(""),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export type Slot = {
  startsAt: string;
  dateLabel: string;
  timeLabel: string;
  dateKey: string;
};

let client: ReturnType<typeof postgres> | undefined;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_NOT_CONFIGURED");
  client ??= postgres(process.env.DATABASE_URL, {
    max: 2,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return client;
}

export function generateCandidateSlots(
  now: DateTime<boolean> = DateTime.now().setZone(bookingConfig.timezone),
): Slot[] {
  const slots: Slot[] = [];
  const earliest = now.plus({ minutes: bookingConfig.leadTimeMinutes });

  for (let offset = 0; offset < bookingConfig.daysAhead; offset += 1) {
    const day = now.startOf("day").plus({ days: offset });
    const hours = bookingConfig.businessHours[day.weekday];
    if (!hours) continue;

    const [startHour, startMinute] = hours.start.split(":").map(Number);
    const [endHour, endMinute] = hours.end.split(":").map(Number);
    let cursor = day.set({ hour: startHour, minute: startMinute });
    const end = day.set({ hour: endHour, minute: endMinute });

    while (cursor.plus({ minutes: bookingConfig.durationMinutes }) <= end) {
      if (cursor > earliest) {
        slots.push({
          startsAt: cursor.toUTC().toISO({ suppressMilliseconds: true })!,
          dateKey: cursor.toISODate()!,
          dateLabel: cursor.setLocale("sv").toFormat("cccc d LLLL"),
          timeLabel: cursor.toFormat("HH.mm"),
        });
      }
      cursor = cursor.plus({ minutes: bookingConfig.durationMinutes });
    }
  }
  return slots;
}

export function isOfferedSlot(startsAt: string, now?: DateTime<boolean>) {
  const utc = DateTime.fromISO(startsAt, { setZone: true }).toUTC();
  if (!utc.isValid) return false;
  const normalized = utc.toISO({ suppressMilliseconds: true });
  return generateCandidateSlots(now).some((slot) => slot.startsAt === normalized);
}

export async function getAvailableSlots() {
  const candidates = generateCandidateSlots();
  if (!isDatabaseConfigured()) {
    return { status: "not_configured" as const, slots: [] as Slot[] };
  }

  const sql = getClient();
  const first = candidates.at(0)?.startsAt ?? new Date().toISOString();
  const last = candidates.at(-1)?.startsAt ?? first;
  const [booked, blocked, blockedDates] = await Promise.all([
    sql<{ starts_at: Date }[]>`select starts_at from bookings where starts_at between ${first} and ${last}`,
    sql<{ starts_at: Date }[]>`select starts_at from blocked_slots where starts_at between ${first} and ${last}`,
    sql<{ blocked_date: string }[]>`select blocked_date::text from blocked_dates`,
  ]);
  const unavailable = new Set(
    [...booked, ...blocked].map((row) => DateTime.fromJSDate(row.starts_at).toUTC().toISO({ suppressMilliseconds: true })),
  );
  const dates = new Set(blockedDates.map((row) => row.blocked_date));

  return {
    status: "ready" as const,
    slots: candidates.filter((slot) => !unavailable.has(slot.startsAt) && !dates.has(slot.dateKey)),
  };
}

class SlotUnavailableError extends Error {
  code = "SLOT_UNAVAILABLE" as const;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]!);
}

async function sendBookingEmails(input: BookingInput) {
  const { RESEND_API_KEY, BOOKING_FROM_EMAIL, BOOKING_NOTIFY_EMAIL } = process.env;
  if (!RESEND_API_KEY || !BOOKING_FROM_EMAIL || !BOOKING_NOTIFY_EMAIL) return "not_configured" as const;

  const resend = new Resend(RESEND_API_KEY);
  const local = DateTime.fromISO(input.startsAt).setZone(bookingConfig.timezone).setLocale("sv");
  const when = `${local.toFormat("cccc d LLLL yyyy 'kl.' HH.mm")} (${bookingConfig.timezone})`;
  const safeName = escapeHtml(input.name);
  const safeCompany = escapeHtml(input.company);
  const safeNeeds = escapeHtml(input.needs || "Ingen beskrivning angiven");

  try {
    const results = await Promise.all([
      resend.emails.send({
        from: BOOKING_FROM_EMAIL,
        to: input.email,
        subject: "Ditt möte med Sandside UF är bokat",
        html: `<h1>Tack ${safeName}!</h1><p>Ditt första möte med Sandside UF är bokat: <strong>${when}</strong>.</p><p>Mötet tar ${bookingConfig.durationMinutes} minuter. Vi hör av oss med möteslänk eller plats.</p>`,
      }),
      resend.emails.send({
        from: BOOKING_FROM_EMAIL,
        to: BOOKING_NOTIFY_EMAIL,
        subject: `Ny bokning: ${safeCompany}`,
        html: `<h1>Ny bokning</h1><p><strong>${safeName}</strong> från ${safeCompany}<br>${when}<br>${escapeHtml(input.email)}</p><p>${safeNeeds}</p>`,
      }),
    ]);
    return results.some((result) => result.error) ? "failed" as const : "sent" as const;
  } catch {
    return "failed" as const;
  }
}

export async function createBooking(input: BookingInput) {
  if (!isDatabaseConfigured()) throw new Error("DATABASE_NOT_CONFIGURED");
  if (!isOfferedSlot(input.startsAt)) throw new SlotUnavailableError("Tiden erbjuds inte längre.");

  const sql = getClient();
  await sql.begin(async (transaction) => {
    const localDate = DateTime.fromISO(input.startsAt).setZone(bookingConfig.timezone).toISODate()!;
    const blocked = await transaction`
      select 1 from blocked_slots where starts_at = ${input.startsAt}
      union all
      select 1 from blocked_dates where blocked_date = ${localDate}::date
      limit 1
    `;
    if (blocked.length) throw new SlotUnavailableError("Tiden är blockerad.");

    const inserted = await transaction`
      insert into bookings (starts_at, duration_minutes, name, company, email, needs)
      values (${input.startsAt}, ${bookingConfig.durationMinutes}, ${input.name}, ${input.company}, ${input.email}, ${input.needs || null})
      on conflict (starts_at) do nothing
      returning starts_at
    `;
    if (!inserted.length) throw new SlotUnavailableError("Tiden hann bokas av någon annan.");
  });

  const emailStatus = await sendBookingEmails(input);
  await sql`update bookings set email_status = ${emailStatus} where starts_at = ${input.startsAt}`;

  const local = DateTime.fromISO(input.startsAt).setZone(bookingConfig.timezone).setLocale("sv");
  return {
    startsAt: input.startsAt,
    dateLabel: local.toFormat("cccc d LLLL yyyy"),
    timeLabel: local.toFormat("HH.mm"),
    timezone: bookingConfig.timezone,
    durationMinutes: bookingConfig.durationMinutes,
    emailStatus,
  };
}

export function isSlotUnavailable(error: unknown): error is SlotUnavailableError {
  return error instanceof SlotUnavailableError;
}
