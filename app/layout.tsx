import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SITE } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import { Suspense } from "react";
import Backgrounds from "@/components/Backgrounds";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Sora({ variable: "--font-sora", subsets: ["latin"] });

export const viewport: Viewport = { themeColor: "#0b0f0d" };

const title = `${SITE.name} | ${SITE.role} in ${SITE.location}`;
const description = `${SITE.name} builds fast websites, online shops with Mobile Money and Paystack, and web apps for businesses in ${SITE.location}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${SITE.name}` },
  description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  openGraph: { type: "website", siteName: SITE.name, locale: "en_GH", title, description },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE.name,
      jobTitle: SITE.role,
      url: SITE_URL,
      telephone: `+${SITE.phoneIntl}`,
      email: SITE.email || undefined,
      address: { "@type": "PostalAddress", addressCountry: "GH" },
      worksFor: { "@id": `${SITE_URL}/#business` },
      sameAs: SITE.social.length ? SITE.social.map((s) => s.href) : undefined,
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: SITE.name,
      url: SITE_URL,
      telephone: `+${SITE.phoneIntl}`,
      description,
      founder: { "@id": `${SITE_URL}/#person` },
      areaServed: [{ "@type": "Country", name: "Ghana" }],
      serviceType: ["Website development", "E-commerce development", "Web application development"],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Suspense fallback={null}>
          <Backgrounds />
        </Suspense>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-background"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
