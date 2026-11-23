import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="footer-logo" href="/" aria-label="Sandside UF, startsida">
            <Image src="/brand/sandside-logo.svg" alt="" width={56} height={56} />
          </Link>
          <p className="footer-copy">Kundanpassade chattbottar för småföretag.</p>
        </div>
        <nav aria-label="Sidfot">
          <Link href="/">Startsida</Link>
          <Link href="/om-oss">Om oss</Link>
          <Link href="/boka">Boka möte</Link>
        </nav>
        <p className="footer-note">Ung Företagsamhet · Sverige</p>
      </div>
    </footer>
  );
}
