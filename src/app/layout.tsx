import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DatitaTech - Transforma tu negocio con Inteligencia Artificial",
  description: "Descubrí cómo la IA puede reducir costos, ahorrar tiempo y abrir nuevas oportunidades para tu empresa. Implementamos soluciones de automatización e inteligencia artificial.",
  keywords: "inteligencia artificial, IA, automatización, transformación digital, DatitaTech, Maxi Chamas",
  icons: {
    icon: '/Logofavicom.png',
    shortcut: '/Logofavicom.png',
    apple: '/Logofavicom.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
