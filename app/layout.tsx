import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menú Digital",
  description: "Menú digital con gestión de productos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
