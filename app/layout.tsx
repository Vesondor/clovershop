import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "svgmap/dist/svgMap.min.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clover Shop",
  description: "Shop Elegance!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <Header />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
