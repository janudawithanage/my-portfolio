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

export const metadata: Metadata = {
  // metadataBase is required for absolute OG/Twitter image URLs.
  // Update to your production domain once deployed.
  metadataBase: new URL("https://janudawithanage.github.io"),
  title: {
    default: "Januda Withanage — Full-Stack & Cloud Engineer",
    template: "%s | Januda Withanage",
  },
  description:
    "Computer Science student at UCSC specialising in Full-Stack Development, Cloud Engineering, and Cybersecurity. Building reliable, scalable, and secure software.",
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
  authors: [{ name: "Januda Withanage", url: "https://janudaw.dev" }],
  creator: "Januda Withanage",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://janudaw.dev",
    title: "Januda Withanage — Full-Stack & Cloud Engineer",
    description:
      "Computer Science student at UCSC. Building reliable, scalable, and secure software.",
    siteName: "Januda Withanage",
  },
  twitter: {
    card: "summary_large_image",
    title: "Januda Withanage",
    description: "CS Student | Full-Stack · Cloud · Cybersecurity",
    creator: "@janudaw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#09091A",
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
