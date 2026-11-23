"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CircleDot, MousePointer2 } from "lucide-react";
import { AnimatedHeroChat, AnimatedHeroTitle, type HeroPhase } from "@/components/animated-hero";
import { OpenChatButton } from "@/components/open-chat-button";

const ease = [0.22, 1, 0.36, 1] as const;
const INTRO_KEY = "sandside-home-intro-seen";

export function HomeOpening() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<HeroPhase>("idle");
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const seen = root.dataset.sandsideIntro === "seen" || sessionStorage.getItem(INTRO_KEY) === "1";

    if (reduceMotion || seen) {
      root.dataset.sandsideIntro = "seen";
      const hideTimer = window.setTimeout(() => setShowIntro(false), 0);
      return () => window.clearTimeout(hideTimer);
    }

    const introAnimation = document.querySelector(".home-intro")?.getAnimations()[0];
    const elapsed = typeof introAnimation?.currentTime === "number" ? introAnimation.currentTime : 0;
    const prepareTimer = window.setTimeout(() => setPhase("prepared"), 0);
    const playTimer = window.setTimeout(() => setPhase("playing"), Math.max(0, 460 - elapsed));
    const finishTimer = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      root.dataset.sandsideIntro = "seen";
      setShowIntro(false);
    }, Math.max(0, 920 - elapsed));

    return () => {
      window.clearTimeout(prepareTimer);
      window.clearTimeout(playTimer);
      window.clearTimeout(finishTimer);
    };
  }, [reduceMotion]);

  const isPrepared = phase === "prepared";
  const isPlaying = phase === "playing";
  const contentState = reduceMotion || !isPrepared ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 };

  return (
    <>
      {showIntro && (
        <div className="home-intro" aria-hidden="true">
          <span>Sandside</span>
        </div>
      )}

      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-heading">
            <motion.p
              className="eyebrow"
              initial={false}
              animate={contentState}
              transition={isPrepared ? { duration: 0 } : { duration: reduceMotion ? 0 : 0.42, ease }}
            >Kundservice för småföretag</motion.p>
            <AnimatedHeroTitle phase={phase} />
          </div>

          <motion.div
            className="home-hero-copy"
            initial={false}
            animate={contentState}
            transition={isPrepared ? { duration: 0 } : { duration: reduceMotion ? 0 : 0.54, delay: isPlaying ? 0.13 : 0, ease }}
          >
            <p className="home-hero-lead">Sandside UF bygger en chattbot utifrån ert företag. Den svarar på vanliga frågor direkt på webbplatsen och visar kunden vidare när personalen behövs.</p>
            <div className="hero-actions">
              <Link className="button" href="/boka">Boka möte <ArrowRight aria-hidden="true" /></Link>
              <OpenChatButton />
            </div>
            <p className="hero-proof"><CircleDot aria-hidden="true" /> Byggd för era priser, tider och tjänster</p>
          </motion.div>

          <div className="home-hero-product"><AnimatedHeroChat phase={phase} /></div>
        </div>
        <div className="hero-scroll-cue" aria-hidden="true"><MousePointer2 /> Scrolla för att följa en fråga <span /></div>
      </section>
    </>
  );
}
