import type { Metadata } from "next";
import HomePage from "@/app/page";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Luxe Universal Wears — premium fashion, bespoke tailoring & luxury accessories for the modern gentleman.",
};

// Mirrors the landing content shown when you click the logo (the "/" route).
export default function Home() {
  return <HomePage />;
}
