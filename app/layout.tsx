import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/outfit";
import "./globals.css";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Sandside UF – Chattbottar för småföretag", template: "%s | Sandside UF" },
  description: "Sandside UF bygger kundanpassade chattbottar som hjälper småföretag att svara på återkommande kundfrågor.",
  icons: { icon: "/brand/sandside-logo.svg", shortcut: "/brand/sandside-logo.svg" },
  openGraph: { title: "Sandside UF", description: "Kundanpassade chattbottar för småföretag.", type: "website", locale: "sv_SE" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("sandside-home-intro-seen")==="1")document.documentElement.dataset.sandsideIntro="seen"}catch(e){}` }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Hoppa till innehållet</a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
