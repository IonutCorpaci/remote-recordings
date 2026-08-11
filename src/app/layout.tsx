import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Remote Recordings",
  description: "Организация еженедельных поездок",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} antialiased pb-20 md:pb-0`}>
        {children}
        <Toaster position="top-center" richColors theme="dark" />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
