import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { generateCandidateSlots, isOfferedSlot } from "./booking";

describe("booking schedule", () => {
  const now: DateTime<boolean> = DateTime.fromISO("2026-11-23T10:00:00", { zone: "Europe/Stockholm" });

  it("generates 30-minute weekday slots in Stockholm time", () => {
    const slots = generateCandidateSlots(now);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0].timeLabel).toBe("16.00");
    expect(slots.every((slot) => [1, 2, 3, 4].includes(DateTime.fromISO(slot.startsAt).setZone("Europe/Stockholm").weekday))).toBe(true);
  });

  it("rejects a time that is not actually offered", () => {
    expect(isOfferedSlot("2026-11-23T12:13:00Z", now)).toBe(false);
  });
});
