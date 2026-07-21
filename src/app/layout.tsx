import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { RootHeader } from "@/components/layout/RootHeader";
import { RootFooter } from "@/components/layout/RootFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "NADI-TANI — Ekosistem Digital dan Fisik Agroindustri Padi",
    template: "%s | NADI-TANI",
  },
  description:
    "Ekosistem digital dan fisik yang menghubungkan petani, ATM Gabah Mandiri, Depo Agroindustri Integrasi, pasar, dan pengolahan hasil samping dalam satu rantai pasok yang transparan.",
  keywords: [
    "NADI-TANI",
    "agroindustri",
    "padi",
    "petani",
    "ATM Gabah",
    "Depo Agroindustri",
    "ketahanan pangan",
    "pertanian digital",
  ],
  authors: [{ name: "Tim NADI-TANI" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NADI-TANI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#064E3B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/logo/logo-bulat-v2.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo/logo-bulat-v2.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo/logo-bulat-v2.png" />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-slate-50" style={{ fontFamily: "var(--font-sans)" }}>
        <NextTopLoader
          color="#2E7D32"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2E7D32,0 0 5px #2E7D32"
        />
        <AuthProvider>
          <RootHeader />
          <main className="flex-1 flex flex-col">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <RootFooter />
        </AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
