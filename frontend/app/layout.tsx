import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Averia_Serif_Libre } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import FloatingLeaves from "@/components/floating-leaves";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const averiaSerifLibre = Averia_Serif_Libre({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-averia",
});

export const metadata: Metadata = {
  title: "LeafCart - Sustainability Tracker",
  description: "Track your sustainability impact across all your shopping",
  generator: "Pranay Ghuge",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${averiaSerifLibre.variable} font-serif antialiased`}>
        <FloatingLeaves />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
