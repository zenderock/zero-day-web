import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZERO_DAY // Architecture GitHub",
  description: "Visualisez votre année GitHub en 3D. Une expérience immersive de data-visualization inspirée de Spotify Wrapped.",
  keywords: ["github", "visualization", "3d", "contributions", "wrapped", "annual report"],
  authors: [{ name: "Zero Day Team" }],
  openGraph: {
    title: "ZERO_DAY // Architecture GitHub",
    description: "Visualisez votre année GitHub en 3D",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZERO_DAY // Architecture GitHub",
    description: "Visualisez votre année GitHub en 3D",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#030303",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
