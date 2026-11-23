"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpenText, Check, ExternalLink, Headphones, MessageSquareText } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    number: "01",
    kicker: "Er information går in",
    title: "Vi lär chatten det ni redan vet.",
    text: "Öppettider, priser, tjänster och vanliga frågor samlas på ett ställe. Ni granskar underlaget innan chatten möter en kund.",
    mode: "sources" as const,
  },
  {
    number: "02",
    kicker: "Ett tydligt svar kommer ut",
    title: "Kunden frågar som vanligt.",
    text: "Chatten hittar rätt information och svarar direkt på webbplatsen – med ert språk och utan att kunden behöver leta vidare.",
    mode: "answer" as const,
  },
  {
    number: "03",
    kicker: "Personal när det behövs",
    title: "När svaret saknas tar en människa över.",
    text: "Botten gissar inte. Den berättar vad den saknar och visar kunden vidare till telefon, mejl eller ert kontaktflöde.",
    mode: "handoff" as const,
  },
];

export function ProcessStory() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section className="story-section" aria-labelledby="story-heading">
      <div className="container story-intro">
        <p className="eyebrow">En liten produkt med ett tydligt jobb</p>
        <h2 id="story-heading">Från er kunskap<br />till kundens svar.</h2>
      </div>
      <div className="container story-grid">
        <div className="story-steps">
          {steps.map((step, index) => (
            <motion.article
              className={active === index ? "story-step active" : "story-step"}
              key={step.number}
              onViewportEnter={() => setActive(index)}
              viewport={{ amount: 0.55 }}
            >
              <span className="story-number">{step.number}</span>
              <p className="story-kicker">{step.kicker}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <div className="story-mobile-product"><StoryProduct mode={step.mode} compact /></div>
            </motion.article>
          ))}
        </div>
        <div className="story-sticky" aria-live="polite">
          <div className="story-product-frame">
            <div className="story-frame-head"><span>Så arbetar chatten</span><span>{active + 1} / 3</span></div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={steps[active].mode}
                initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12, scale: 0.985 }}
                transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
              >
                <StoryProduct mode={steps[active].mode} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryProduct({ mode, compact = false }: { mode: "sources" | "answer" | "handoff"; compact?: boolean }) {
  return (
    <div className={compact ? "story-product compact" : "story-product"}>
      {mode === "sources" && (
        <div className="source-view">
          <div className="product-status"><BookOpenText aria-hidden="true" /><span><strong>Kunskapsbank</strong><small>3 källor är redo</small></span><Check aria-hidden="true" /></div>
          <div className="source-row"><span>Öppettider</span><small>Webbplats</small><i>Uppdaterad</i></div>
          <div className="source-row"><span>Prislista 2026</span><small>PDF-dokument</small><i>Uppdaterad</i></div>
          <div className="source-row"><span>Vanliga frågor</span><small>Manuellt underlag</small><i>Uppdaterad</i></div>
        </div>
      )}
      {mode === "answer" && (
        <div className="answer-view">
          <div className="product-status"><MessageSquareText aria-hidden="true" /><span><strong>På webbplatsen</strong><small>Stadens Trafikskola</small></span><span className="live-badge">Live</span></div>
          <div className="mini-chat user">Vad kostar en körlektion?</div>
          <div className="mini-chat bot">En körlektion på 50 minuter kostar <strong>720 kr</strong>.</div>
          <div className="mini-citation"><Check aria-hidden="true" /> Kontrollerat mot Prislista 2026</div>
        </div>
      )}
      {mode === "handoff" && (
        <div className="handoff-view">
          <div className="product-status"><Headphones aria-hidden="true" /><span><strong>Hjälp från personalen</strong><small>En tydlig väg vidare</small></span></div>
          <div className="mini-chat user">Kan jag betala med presentkort?</div>
          <div className="mini-chat bot">Det svaret finns inte i min information. Receptionen hjälper dig gärna vidare.</div>
          <div className="handoff-action">Kontakta receptionen <ExternalLink aria-hidden="true" /></div>
        </div>
      )}
    </div>
  );
}
