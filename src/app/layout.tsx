import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ChromeHeader, ChromeFooter } from "@/components/layout/ChromeGate";
import { Toast } from "@/components/ui/Toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luxeuniversalwears.com"),
  title: {
    default: "Luxe Universal Wears — Premium Fashion & Bespoke Tailoring",
    template: "%s · Luxe Universal Wears",
  },
  description:
    "Premium fashion, bespoke tailoring & luxury accessories for the modern gentleman. Suits, tuxedos, footwear & more — delivered across Nigeria and worldwide.",
  keywords: [
    "luxury menswear Nigeria",
    "bespoke tailoring Abuja",
    "tuxedos",
    "suits",
    "designer fashion",
  ],
  openGraph: {
    title: "Luxe Universal Wears",
    description: "Elevate Your Style. Define Your Presence.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        <AuthProvider>
          <StoreProvider>
            <ChromeHeader />
            <main>{children}</main>
            <ChromeFooter />
            <Toast />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
