import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multiverse Converter",
  description: "Convert characters into the Multiverse TTRPG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
