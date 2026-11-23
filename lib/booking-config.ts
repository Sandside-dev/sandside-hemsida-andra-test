export const bookingConfig = {
  timezone: "Europe/Stockholm",
  durationMinutes: 30,
  leadTimeMinutes: 60,
  daysAhead: 28,
  businessHours: {
    1: { start: "16:00", end: "19:00" },
    2: { start: "16:00", end: "19:00" },
    3: { start: "16:00", end: "19:00" },
    4: { start: "16:00", end: "19:00" },
  } as Record<number, { start: string; end: string }>,
};
