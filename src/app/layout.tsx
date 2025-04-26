import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/shared/components/ToastProvider";
import { ThemeProvider } from "@/shared/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EHC ERP - Sistema de Gestión para Floricultura",
  description: "Plataforma especializada en la gestión logística y documental para exportación de flores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Providers */}
        <ThemeProvider
          defaultTheme="system"
          storageKey="ehc-erp-theme"
        >
          <ToastProvider />
          {/* Contenido principal */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}