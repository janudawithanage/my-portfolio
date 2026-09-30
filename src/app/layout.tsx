import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
const siteDescription =
  "Januda Withanage's portfolio of full-stack applications, cloud and IoT projects, and Computer Science work at UCSC. Explore selected projects, skills, and GitHub activity.";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Januda Withanage | Software Engineer",
    template: "%s | Januda Withanage",
  },
  description: siteDescription,
  keywords: [
    "Januda Withanage",
    "portfolio",
    "full-stack developer",
    "cloud engineer",
    "cybersecurity",
    "UCSC",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Januda Withanage", url: "https://github.com/janudawithanage" }],
  creator: "Januda Withanage",
  openGraph: {
    type: "website",
    locale: "en_US",
    ...(siteUrl ? { url: siteUrl } : {}),
    title: "Januda Withanage | Software Engineer",
    description: siteDescription,
    siteName: "Januda Withanage",
  },
  twitter: {
    card: "summary",
    title: "Januda Withanage | Software Engineer",
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
