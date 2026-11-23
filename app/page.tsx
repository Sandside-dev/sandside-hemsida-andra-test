import Link from "next/link";
import { ArrowRight, Check, MessageCircleMore } from "lucide-react";
import { HomeOpening } from "@/components/home-opening";
import { ProcessStory } from "@/components/process-story";
import { QuestionsStage } from "@/components/questions-stage";
import { Reveal } from "@/components/reveal";

export default function HomePage() {
  return (
    <>
      <HomeOpening />

      <QuestionsStage />
      <ProcessStory />

      <section className="pilot-redesign">
        <div className="container pilot-redesign-grid">
          <Reveal direction="left" className="pilot-visual-wrap">
            <div className="pilot-visual" aria-label="Illustrerad produktvy för pilotprojektet JC Trafikskola">
              <div className="pilot-browser-bar"><i /><i /><i /><span>JC Trafikskola · pilot</span></div>
              <div className="pilot-browser-body">
                <div className="pilot-road" aria-hidden="true"><span /><span /><span /></div>
                <div className="pilot-chat-card"><span className="pilot-badge">Pilotprojekt</span><p>“Hur bokar jag en körlektion?”</p><div><MessageCircleMore aria-hidden="true" /><span>Chatten hittar rätt väg<br /><strong>på webbplatsen</strong></span></div></div>
              </div>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.12} className="pilot-copy-redesign">
            <p className="eyebrow">JC Trafikskola</p>
            <h2>En riktig verksamhet. En lösning att lära av.</h2>
            <p>JC Trafikskola är Sandside UF:s pilotprojekt: en chattbot för kundservice på trafikskolans webbplats. Där testar vi hur svar, hänvisningar och själva kundflödet fungerar i praktiken.</p>
            <p className="pilot-disclaimer">Vi använder bara bekräftad information och publicerar inga kundcitat, resultat eller logotyper utan godkänt underlag.</p>
          </Reveal>
        </div>
      </section>

      <section className="price-redesign">
        <div className="container price-redesign-grid">
          <Reveal>
            <p className="eyebrow">Ett tydligt spann</p>
            <h2><span>6 000</span>–<span>15 000</span> kr</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="price-intro">Priset formas efter hur mycket chatten ska kunna, vilka kundvägar som behövs och hur införandet ser ut.</p>
            <ul className="check-list">
              <li><Check aria-hidden="true" /> Behovsgenomgång</li>
              <li><Check aria-hidden="true" /> Byggd och testad chatt</li>
              <li><Check aria-hidden="true" /> Hjälp med införandet</li>
            </ul>
            <p>Exakt pris diskuterar vi på mötet.</p>
          </Reveal>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="container">
          <Reveal className="home-final-copy">
            <p className="eyebrow">Första mötet tar 30 minuter</p>
            <h2>Vilken fråga svarar ni på varje dag?</h2>
            <p>Ta med den till mötet. Vi visar hur den kan bli början på en bättre kundservice.</p>
            <Link className="button button-light" href="/boka">Boka ett första möte <ArrowRight aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
