import type { Metadata } from "next";
import { Cormorant, Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navigation } from "@/components/layout/Navigation";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Curiosity Inc — Ideas Need Structure",
  description:
    "Premium content systems for serious operators. We build the infrastructure behind your ideas.",
  openGraph: {
    title: "Curiosity Inc",
    description: "Ideas need structure. We build it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${bebas.variable}`}
    >
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <CustomCursor />
        <Navigation />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
