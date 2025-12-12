import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Menú Digital - Cocina Mexicana Auténtica",
  description: "Explora nuestro menú de auténtica cocina mexicana con opciones modernas y vintage",
  applicationName: "Menú Digital",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Menú Digital",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className} style={{ backgroundColor: '#FAF8F5' }}>
      <head>
        <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body style={{ backgroundColor: '#FAF8F5' }}>{children}</body>
    </html>
  );
}
