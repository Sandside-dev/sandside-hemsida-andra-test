"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, MessageCircleMore } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
export type HeroPhase = "idle" | "prepared" | "playing";

export function AnimatedHeroTitle({ phase }: { phase: HeroPhase }) {
  const reduceMotion = useReducedMotion();
  const lines = ["Ge kunderna", "svar direkt."];
  const isPrepared = phase === "prepared";

  return (
    <h1 className="home-hero-title" aria-label="Ge kunderna svar direkt.">
      {lines.map((line, index) => (
        <span className="hero-line-mask" key={line} aria-hidden="true">
          <motion.span
            initial={false}
            animate={reduceMotion || !isPrepared ? { opacity: 1, y: 0 } : { opacity: 0, y: 34 }}
            transition={isPrepared ? { duration: 0 } : { duration: reduceMotion ? 0 : 0.58, delay: phase === "playing" ? index * 0.08 : 0, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export function AnimatedHeroChat({ phase }: { phase: HeroPhase }) {
  const reduceMotion = useReducedMotion();
  const isPrepared = phase === "prepared";
  const isPlaying = phase === "playing";
  const hidden = { opacity: 0, y: 34 };
  const shown = { opacity: 1, y: 0 };

  return (
    <motion.div
      className="hero-product-shell"
      initial={false}
      animate={reduceMotion || !isPrepared ? shown : hidden}
      transition={isPrepared ? { duration: 0 } : { duration: reduceMotion ? 0 : 0.76, delay: isPlaying ? 0.14 : 0, ease }}
      aria-label="Animerat exempel på en kundservicechatt"
    >
      <div className="product-window-bar">
        <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
        <span>stadens-trafikskola.se</span>
        <span className="demo-pill">Demo</span>
      </div>
      <div className="hero-product-body">
        <div className="hero-product-brand"><span className="brand-mark"><MessageCircleMore aria-hidden="true" /></span><div><strong>Stadens Trafikskola</strong><small>Vi svarar direkt</small></div><span className="online-dot">Online</span></div>
        <div className="hero-chat-flow" aria-live="off">
          <motion.div
            className="preview-message preview-user"
            initial={false}
            animate={reduceMotion || !isPrepared ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={isPrepared ? { duration: 0 } : { duration: reduceMotion ? 0 : 0.38, delay: isPlaying ? 0.72 : 0, ease }}
          >
            Vad kostar en körlektion?
          </motion.div>
          <motion.div
            className="typing-indicator"
            initial={false}
            animate={reduceMotion || !isPlaying ? { opacity: 0, y: 0 } : { opacity: [0, 1, 1, 0], y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.82, delay: isPlaying ? 1.04 : 0, times: [0, 0.18, 0.7, 1] }}
            aria-hidden="true"
          ><i /><i /><i /></motion.div>
          <motion.div
            className="preview-message preview-bot"
            initial={false}
            animate={reduceMotion || !isPrepared ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.985 }}
            transition={isPrepared ? { duration: 0 } : { duration: reduceMotion ? 0 : 0.54, delay: isPlaying ? 1.76 : 0, ease }}
          >
            En körlektion på 50 minuter kostar <strong>720 kr</strong>. Vill du veta hur du bokar?
          </motion.div>
          <motion.div
            className="answer-source"
            initial={false}
            animate={reduceMotion || !isPrepared ? { opacity: 1 } : { opacity: 0 }}
            transition={isPrepared ? { duration: 0 } : { duration: reduceMotion ? 0 : 0.34, delay: isPlaying ? 2.18 : 0 }}
          ><Check aria-hidden="true" /> Svar från trafikskolans prislista</motion.div>
        </div>
        <div className="hero-chat-input"><span>Skriv en fråga …</span><span className="send-disc"><MessageCircleMore aria-hidden="true" /></span></div>
      </div>
    </motion.div>
  );
}
