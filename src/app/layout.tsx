import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { content, fullName } from "@/data";
import { siteUrl } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const siteDescription = content.hero.bio;
// Social images need an absolute origin, so they are only advertised once the site URL is known.
const socialImage = { url: "/images/og.jpg", width: 1200, height: 630, alt: fullName + " — " + content.hero.role };

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } } : {}),
  title: {
    default: fullName + " | Portfolio",
    template: "%s | " + fullName,
  },
  description: siteDescription,
  keywords: [
    fullName,
    "portfolio",
    "full-stack developer",
    "cloud engineer",
    "cybersecurity",
    "UCSC",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: fullName, url: content.hero.githubUrl }],
  creator: fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    ...(siteUrl ? { url: siteUrl, images: [socialImage] } : {}),
    title: fullName + " | Portfolio",
    description: siteDescription,
    siteName: fullName,
  },
  twitter: {
    card: siteUrl ? "summary_large_image" : "summary",
    title: fullName + " | Portfolio",
    description: siteDescription,
    ...(siteUrl ? { images: [socialImage.url] } : {}),
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#080D19",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-text-primary antialiased">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
