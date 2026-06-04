"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, Check, Shuffle, ShoppingBag, X } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useStore } from "@/components/providers/StoreProvider";

type SlotKey = "top" | "bottom" | "outerwear" | "footwear" | "accessory";

const SLOTS: { key: SlotKey; label: string; categories: string[] }[] = [
  { key: "top", label: "Top", categories: ["polo-shirts", "t-shirts"] },
  { key: "bottom", label: "Bottom", categories: ["chinos"] },
  { key: "outerwear", label: "Outerwear", categories: ["jackets", "blazers", "suits", "tuxedos"] },
  { key: "footwear", label: "Footwear", categories: ["corporate-shoes", "casual-shoes", "slides"] },
  { key: "accessory", label: "Accessory", categories: ["slides", "t-shirts", "polo-shirts"] },
];

function groupForSlot(categories: string[]): Product[] {
  return products.filter((p) => categories.includes(p.category));
}

function randomFrom<T>(arr: T[]): T | null {
  return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
}

export default function OutfitBuilderPage() {
  const { addToCart } = useStore();

  const slotProducts = useMemo(() => {
    const map = {} as Record<SlotKey, Product[]>;
    SLOTS.forEach((s) => {
      map[s.key] = groupForSlot(s.categories);
    });
    return map;
  }, []);

  const [selection, setSelection] = useState<Record<SlotKey, Product | null>>({
    top: null,
    bottom: null,
    outerwear: null,
    footwear: null,
    accessory: null,
  });
  const [activeSlot, setActiveSlot] = useState<SlotKey>("outerwear");
  const [added, setAdded] = useState(false);

  const selected = SLOTS.map((s) => selection[s.key]).filter(Boolean) as Product[];
  const total = selected.reduce((sum, p) => sum + p.price, 0);

  function choose(slot: SlotKey, product: Product) {
    setSelection((prev) => ({
      ...prev,
      [slot]: prev[slot]?.id === product.id ? null : product,
    }));
    setAdded(false);
  }

  function shuffle() {
    const next = {} as Record<SlotKey, Product | null>;
    SLOTS.forEach((s) => {
      next[s.key] = randomFrom(slotProducts[s.key]);
    });
    setSelection(next);
    setAdded(false);
  }

  function clearAll() {
    setSelection({ top: null, bottom: null, outerwear: null, footwear: null, accessory: null });
    setAdded(false);
  }

  function addLook() {
    if (selected.length === 0) return;
    selected.forEach((p) => addToCart(p));
    setAdded(true);
  }

  const activeList = slotProducts[activeSlot];

  return (
    <main className="bg-ivory">
      {/* Hero */}
      <section className="border-b border-sand bg-cream">
        <Container className="py-16 text-center sm:py-20">
          <p className="eyebrow mb-4">Style Studio</p>
          <h1 className="mx-auto max-w-3xl text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            Build Your Look
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-stone leading-relaxed">
            Assemble a complete outfit one piece at a time. Pick a slot, choose your favourites, or
            let us surprise you — then send the whole look to your bag in a single tap.
          </p>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left: preview + summary */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Your Outfit</p>
                  {selected.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.16em] text-stone transition hover:text-ink"
                    >
                      <X size={13} /> Clear
                    </button>
                  )}
                </div>

                {/* Preview tiles */}
                <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-3">
                  {SLOTS.map((s) => {
                    const p = selection[s.key];
                    return (
                      <button
                        key={s.key}
                        onClick={() => setActiveSlot(s.key)}
                        className={clsx(
                          "group relative aspect-[3/4] overflow-hidden rounded-xl border bg-cream text-left transition",
                          activeSlot === s.key ? "border-ink" : "border-sand hover:border-ink/50"
                        )}
                      >
                        {p ? (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center px-2 text-center text-[0.6rem] uppercase tracking-[0.14em] text-mist">
                            {s.label}
                          </span>
                        )}
                        <span className="absolute left-0 top-0 bg-ink/85 px-2 py-1 text-[0.55rem] uppercase tracking-[0.16em] text-ivory">
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="mt-7 border border-sand bg-cream p-6">
                  <ul className="space-y-3">
                    {selected.length === 0 && (
                      <li className="text-sm text-stone">No pieces selected yet — start building.</li>
                    )}
                    {SLOTS.map((s) => {
                      const p = selection[s.key];
                      if (!p) return null;
                      return (
                        <li key={s.key} className="flex items-center justify-between gap-3 text-sm">
                          <span className="truncate text-charcoal">
                            <span className="text-[0.6rem] uppercase tracking-[0.14em] text-mist">
                              {s.label}
                            </span>
                            <br />
                            {p.name}
                          </span>
                          <span className="shrink-0 font-medium text-ink">{formatNaira(p.price)}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-5 flex items-center justify-between border-t border-sand pt-4">
                    <span className="text-[0.7rem] uppercase tracking-[0.18em] text-stone">
                      Total ({selected.length} {selected.length === 1 ? "piece" : "pieces"})
                    </span>
                    <span className="font-serif text-2xl text-ink">{formatNaira(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    variant={added ? "gold" : "primary"}
                    size="lg"
                    className="w-full"
                    onClick={addLook}
                    disabled={selected.length === 0}
                  >
                    {added ? (
                      <>
                        <Check size={16} /> Look Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} /> Add Look to Bag
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={shuffle}>
                    <Shuffle size={16} /> Surprise Me
                  </Button>
                  {added && (
                    <Link
                      href="/cart"
                      className="inline-flex items-center justify-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-ink transition hover:text-blue-deep"
                    >
                      View Bag <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Right: picker */}
            <div className="lg:col-span-7">
              {/* Slot tabs */}
              <div className="flex flex-wrap gap-2.5">
                {SLOTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSlot(s.key)}
                    className={clsx(
                      "rounded-full border px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.16em] transition",
                      activeSlot === s.key
                        ? "border-ink bg-ink text-ivory"
                        : "border-sand text-stone hover:border-ink hover:text-ink"
                    )}
                  >
                    {s.label}
                    {selection[s.key] && (
                      <Check size={12} className="ml-1.5 inline -translate-y-px text-blue" />
                    )}
                  </button>
                ))}
              </div>

              <SectionHeading
                align="left"
                title={`Choose Your ${SLOTS.find((s) => s.key === activeSlot)?.label}`}
                className="mt-8 mb-6"
              />

              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                {activeList.map((p) => {
                  const isPicked = selection[activeSlot]?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => choose(activeSlot, p)}
                      className="group text-left"
                    >
                      <div
                        className={clsx(
                          "relative aspect-[3/4] overflow-hidden rounded-xl border bg-cream transition",
                          isPicked ? "border-ink ring-1 ring-ink" : "border-transparent"
                        )}
                      >
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {isPicked && (
                          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-ivory">
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 text-sm font-medium leading-snug text-ink">{p.name}</h3>
                      <p className="mt-1 text-sm text-stone">{formatNaira(p.price)}</p>
                    </button>
                  );
                })}
              </div>

              {activeList.length === 0 && (
                <p className="mt-10 text-sm text-stone">No items available for this slot.</p>
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
