"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Startsida" },
  { href: "/om-oss", label: "Om oss" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand-logo" href="/" aria-label="Sandside UF, startsida">
          <Image src="/brand/sandside-logo.svg" alt="" width={48} height={48} priority />
        </Link>
        <nav className="main-nav" aria-label="Huvudmeny">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "nav-link active" : "nav-link"}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="button button-small header-cta" href="/boka">
          Boka möte
        </Link>
      </div>
    </header>
  );
}
