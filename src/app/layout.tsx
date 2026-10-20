import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { content, fullName } from "@/data";
import { MotionProvider } from "@/components/ui/MotionProvider";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const siteDescription = content.hero.bio;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
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
    ...(siteUrl ? { url: siteUrl } : {}),
    title: fullName + " | Portfolio",
    description: siteDescription,
    siteName: fullName,
  },
  twitter: {
    card: "summary",
    title: fullName + " | Portfolio",
    description: siteDescription,
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
        <MotionProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
