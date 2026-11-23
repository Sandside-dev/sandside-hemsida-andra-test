import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { team } from "@/lib/team";

export const metadata: Metadata = { title: "Om oss", description: "Lär känna teamet bakom Sandside UF och varför vi bygger chattbottar för småföretag." };

export default function AboutPage() {
  return (
    <>
      <section className="page-hero section">
        <div className="container page-hero-grid"><Reveal direction="left"><p className="eyebrow">Om Sandside UF</p></Reveal><Reveal direction="right" delay={0.08}><div><h1>Fem perspektiv. Ett tydligt mål.</h1><p>Vi startade Sandside UF för att göra kundservice enklare för småföretag. Många verksamheter tappar tid på återkommande frågor, samtidigt som kunder förväntar sig snabba svar. Där vill vi göra konkret nytta – med en lösning som är lätt att förstå och trygg att använda.</p></div></Reveal></div>
      </section>
      <section className="section team-section">
        <div className="container"><div className="section-intro"><p className="eyebrow">Teamet</p><h2>Vi bygger nära både kunden och varandra.</h2></div>
          <div className="team-list">
            {team.map((member, index) => (
              <Reveal key={member.name} direction={index % 2 === 0 ? "left" : "right"} amount={0.12}>
              <article className="team-member">
                <div className="portrait-wrap">
                  <Image src={member.image} alt={`Tillfällig porträttbild för ${member.name}`} width={800} height={1000} sizes="(max-width: 700px) 100vw, 38vw" loading="eager" />
                  <span>Platshållarbild</span>
                </div>
                <div className="member-copy"><p className="member-index">0{index + 1}</p><h2>{member.name}</h2><p className="member-role">{member.role}</p><p>{member.text}</p></div>
              </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section about-cta"><div className="container split-heading"><div><p className="eyebrow">Prata med oss</p><h2>Nyfiken på vad en chatt kan göra för er?</h2></div><div><p>På ett första möte lyssnar vi på era behov och visar hur vi arbetar.</p><Link className="button" href="/boka">Boka ett möte <ArrowRight aria-hidden="true" /></Link></div></div></section>
    </>
  );
}
