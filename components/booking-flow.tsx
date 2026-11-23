"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CalendarDays, Check, Clock, Mail, RefreshCw } from "lucide-react";

type Slot = { startsAt: string; dateLabel: string; timeLabel: string; dateKey: string };
type Availability = {
  status: "ready" | "not_configured" | "error";
  slots: Slot[];
  timezone?: string;
  durationMinutes?: number;
  message?: string;
};

type Confirmation = {
  startsAt: string;
  dateLabel: string;
  timeLabel: string;
  timezone: string;
  durationMinutes: number;
  emailStatus: "sent" | "failed" | "not_configured";
};

export function BookingFlow() {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  async function loadAvailability() {
    try {
      const response = await fetch("/api/availability", { cache: "no-store" });
      const data = (await response.json()) as Availability;
      setAvailability(data);
      if (data.status === "ready" && data.slots.length) setSelectedDate(data.slots[0].dateKey);
    } catch {
      setAvailability({ status: "error", slots: [], message: "Lediga tider kunde inte hämtas just nu." });
    }
  }

  useEffect(() => {
    let active = true;
    fetch("/api/availability", { cache: "no-store" })
      .then(async (response) => (await response.json()) as Availability)
      .then((data) => {
        if (!active) return;
        setAvailability(data);
        if (data.status === "ready" && data.slots.length) setSelectedDate(data.slots[0].dateKey);
      })
      .catch(() => {
        if (active) setAvailability({ status: "error", slots: [], message: "Lediga tider kunde inte hämtas just nu." });
      });
    return () => { active = false; };
  }, []);

  const days = useMemo(() => {
    const unique = new Map<string, string>();
    availability?.slots.forEach((slot) => unique.set(slot.dateKey, slot.dateLabel));
    return [...unique.entries()].map(([dateKey, label]) => ({ dateKey, label }));
  }, [availability]);

  const times = availability?.slots.filter((slot) => slot.dateKey === selectedDate) ?? [];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setError("");
    setFieldErrors({});
    const form = new FormData(event.currentTarget);
    const payload = {
      startsAt: selectedSlot.startsAt,
      name: form.get("name"),
      company: form.get("company"),
      email: form.get("email"),
      needs: form.get("needs"),
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message ?? "Bokningen kunde inte sparas.");
        setFieldErrors(data.fields ?? {});
        if (response.status === 409) {
          setSelectedSlot(null);
          await loadAvailability();
        }
        window.setTimeout(() => errorRef.current?.focus(), 0);
        return;
      }
      setConfirmation(data.booking as Confirmation);
    } catch {
      setError("Bokningen kunde inte skickas. Kontrollera anslutningen och försök igen.");
      window.setTimeout(() => errorRef.current?.focus(), 0);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <section className="booking-card confirmation" aria-labelledby="confirmation-title">
        <div className="confirmation-icon"><Check aria-hidden="true" /></div>
        <p className="eyebrow">Bokningen är sparad</p>
        <h2 id="confirmation-title">Vi ses {confirmation.dateLabel}</h2>
        <div className="confirmation-details">
          <p><Clock aria-hidden="true" /> Kl. {confirmation.timeLabel} · {confirmation.durationMinutes} minuter</p>
          <p><CalendarDays aria-hidden="true" /> Tidszon: {confirmation.timezone}</p>
        </div>
        {confirmation.emailStatus === "sent" && (
          <p className="status success"><Mail aria-hidden="true" /> En bekräftelse har skickats till din mejl.</p>
        )}
        {confirmation.emailStatus === "failed" && (
          <p className="status warning">Bokningen är sparad, men mejlet kunde inte skickas. Sandside kan fortfarande se bokningen.</p>
        )}
        {confirmation.emailStatus === "not_configured" && (
          <p className="status neutral">Bokningen är sparad. Mejlfunktionen är inte konfigurerad ännu, så ingen bekräftelse skickades.</p>
        )}
      </section>
    );
  }

  return (
    <section className="booking-card" aria-labelledby="booking-flow-title">
      <div className="booking-card-head">
        <div>
          <p className="eyebrow">30 minuter · Europe/Stockholm</p>
          <h2 id="booking-flow-title">{selectedSlot ? "Dina uppgifter" : "Välj en ledig tid"}</h2>
        </div>
        <span className="step-indicator">Steg {selectedSlot ? "2" : "1"} av 2</span>
      </div>

      {!availability && <div className="loading-state" aria-live="polite">Hämtar lediga tider …</div>}

      {availability?.status !== "ready" && availability && (
        <div className="service-notice" role="status">
          <CalendarDays aria-hidden="true" />
          <div>
            <h3>Bokningen är inte tillgänglig</h3>
            <p>{availability.message}</p>
            {availability.status === "error" && (
              <button className="text-button" type="button" onClick={() => { setAvailability(null); setError(""); void loadAvailability(); }}>
                <RefreshCw aria-hidden="true" size={17} /> Försök igen
              </button>
            )}
          </div>
        </div>
      )}

      {availability?.status === "ready" && !selectedSlot && (
        <div className="slot-picker">
          {days.length === 0 ? (
            <div className="service-notice"><p>Det finns inga lediga tider just nu. Kom gärna tillbaka senare.</p></div>
          ) : (
            <>
              <fieldset>
                <legend>Välj dag</legend>
                <div className="day-list">
                  {days.map((day) => (
                    <button
                      type="button"
                      key={day.dateKey}
                      className={selectedDate === day.dateKey ? "day-button selected" : "day-button"}
                      aria-pressed={selectedDate === day.dateKey}
                      onClick={() => setSelectedDate(day.dateKey)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>Välj tid</legend>
                <div className="time-grid">
                  {times.map((slot) => (
                    <button type="button" key={slot.startsAt} onClick={() => setSelectedSlot(slot)}>
                      {slot.timeLabel}
                    </button>
                  ))}
                </div>
              </fieldset>
            </>
          )}
        </div>
      )}

      {availability?.status === "ready" && selectedSlot && (
        <form onSubmit={submit} noValidate>
          <button className="back-button" type="button" onClick={() => setSelectedSlot(null)}>
            <ArrowLeft aria-hidden="true" size={18} /> Byt tid
          </button>
          <div className="selected-time">
            <CalendarDays aria-hidden="true" />
            <div><strong>{selectedSlot.dateLabel}</strong><span>Kl. {selectedSlot.timeLabel} · 30 minuter</span></div>
          </div>
          {error && (
            <div ref={errorRef} className="error-summary" role="alert" tabIndex={-1}>
              <h3>Det finns ett problem</h3><p>{error}</p>
            </div>
          )}
          <div className="form-grid">
            <Field id="name" label="Namn" autoComplete="name" error={fieldErrors.name?.[0]} />
            <Field id="company" label="Företag" autoComplete="organization" error={fieldErrors.company?.[0]} />
            <Field id="email" label="Mejladress" type="email" autoComplete="email" error={fieldErrors.email?.[0]} />
            <div className="field full-width">
              <label htmlFor="needs">Vad vill ni ha hjälp med? <span>(valfritt)</span></label>
              <textarea id="needs" name="needs" rows={4} aria-describedby="needs-help" />
              <p id="needs-help" className="field-help">Några meningar räcker. Vi går igenom detaljerna på mötet.</p>
            </div>
          </div>
          <button className="button submit-button" type="submit" disabled={submitting}>
            {submitting ? "Sparar bokningen …" : "Bekräfta bokning"}
          </button>
          <p className="privacy-note">Uppgifterna används endast för att hantera mötet.</p>
        </form>
      )}
    </section>
  );
}

function Field({ id, label, error, type = "text", autoComplete }: {
  id: string; label: string; error?: string; type?: string; autoComplete: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} type={type} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}
