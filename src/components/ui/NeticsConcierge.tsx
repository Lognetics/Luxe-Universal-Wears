"use client";

import { createElement } from "react";
import Script from "next/script";

const agentId = process.env.NEXT_PUBLIC_NETICS_AGENT_ID?.trim();
const apiBase = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");

/**
 * Loads the NETICS storefront concierge only when a public agent ID is configured.
 * WhatsApp remains available as the human fallback if the widget is unavailable.
 */
export function NeticsConcierge() {
  if (!agentId) return null;

  return (
    <>
      <Script
        id="netics-agent-sdk"
        src={`${apiBase}/embed/netics-agent.js`}
        strategy="lazyOnload"
      />
      {createElement("netics-agent", {
        "agent-id": agentId,
        "api-base": apiBase,
        position: "bottom-right",
        "primary-color": "#0098d8",
        title: "Luxe Concierge",
        placeholder: "Ask about styles, sizing or delivery…",
        "aria-label": "Open the Luxe AI concierge",
      })}
    </>
  );
}
