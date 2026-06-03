"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X, Check, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import type { Product, Category } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { formatNaira, titleCase } from "@/lib/format";

const COLOR_HEX: Record<string, string> = {
  black: "#14110f",
  white: "#f6f1e9",
  navy: "#1f2a44",
  grey: "#8a8a8a",
  brown: "#6b4a2f",
  olive: "#5d5a3a",
  cream: "#efe6d4",
  beige: "#d8c7a8",
  blue: "#3a5a8c",
  orange: "#c4632a",
  multicolor: "#b8924a",
  camel: "#bd8f5a",
  green: "#3a5d44",
  purple: "#5c3a6b",
  red: "#8c2f2f",
  tan: "#c9a274",
};

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

type Filters = {
  categories: string[];
  sizes: string[];
  colors: string[];
  brands: string[];
  maxPrice: number;
  onSale: boolean;
  sort: string;
  query: string;
};

function toggle(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function ShopClient({
  products,
  populatedCats,
  allSizes,
  allColors,
  allBrands,
  priceMax,
  initial,
}: {
  products: Product[];
  populatedCats: Category[];
  allSizes: string[];
  allColors: string[];
  allBrands: string[];
  priceMax: number;
  initial: Partial<Filters>;
}) {
  const [filters, setFilters] = useState<Filters>({
    categories: initial.categories ?? [],
    sizes: initial.sizes ?? [],
    colors: initial.colors ?? [],
    brands: initial.brands ?? [],
    maxPrice: initial.maxPrice ?? priceMax,
    onSale: initial.onSale ?? false,
    sort: initial.sort ?? "featured",
    query: initial.query ?? "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Only show sizes that actually appear on products
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return allSizes.filter((s) => set.has(s));
  }, [products, allSizes]);

  const filtered = useMemo(() => {
    let result = [...products];
    const { categories, sizes, colors, brands, maxPrice, onSale, sort, query } = filters;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    if (categories.length) result = result.filter((p) => categories.includes(p.category));
    if (sizes.length) result = result.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (colors.length) result = result.filter((p) => p.colors.some((c) => colors.includes(c)));
    if (brands.length) result = result.filter((p) => brands.includes(p.brand));
    result = result.filter((p) => p.price <= maxPrice);
    if (onSale) result = result.filter((p) => p.comparePrice);

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.createdIndex - a.createdIndex);
        break;
      default:
        result.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    }
    return result;
  }, [products, filters]);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    filters.categories.forEach((c) => {
      const cat = populatedCats.find((x) => x.slug === c);
      chips.push({
        key: `cat-${c}`,
        label: cat?.name ?? c,
        clear: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })),
      });
    });
    filters.sizes.forEach((s) =>
      chips.push({
        key: `size-${s}`,
        label: `Size ${s}`,
        clear: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })),
      })
    );
    filters.colors.forEach((c) =>
      chips.push({
        key: `color-${c}`,
        label: titleCase(c),
        clear: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })),
      })
    );
    filters.brands.forEach((b) =>
      chips.push({
        key: `brand-${b}`,
        label: b,
        clear: () => setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) })),
      })
    );
    if (filters.onSale)
      chips.push({
        key: "sale",
        label: "On Sale",
        clear: () => setFilters((f) => ({ ...f, onSale: false })),
      });
    if (filters.maxPrice < priceMax)
      chips.push({
        key: "price",
        label: `Under ${formatNaira(filters.maxPrice)}`,
        clear: () => setFilters((f) => ({ ...f, maxPrice: priceMax })),
      });
    if (filters.query)
      chips.push({
        key: "query",
        label: `“${filters.query}”`,
        clear: () => setFilters((f) => ({ ...f, query: "" })),
      });
    return chips;
  }, [filters, populatedCats, priceMax]);

  const clearAll = () =>
    setFilters((f) => ({
      ...f,
      categories: [],
      sizes: [],
      colors: [],
      brands: [],
      maxPrice: priceMax,
      onSale: false,
      query: "",
    }));

  const sidebar = (
    <div className="space-y-9">
      <FilterSection title="Categories">
        <ul className="space-y-2.5">
          {populatedCats.map((c) => (
            <li key={c.slug}>
              <CheckRow
                checked={filters.categories.includes(c.slug)}
                onChange={() =>
                  setFilters((f) => ({ ...f, categories: toggle(f.categories, c.slug) }))
                }
              >
                <span className="flex w-full items-center justify-between">
                  <span>{c.name}</span>
                  <span className="text-[0.7rem] text-mist">{c.count}</span>
                </span>
              </CheckRow>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((s) => (
            <button
              key={s}
              onClick={() => setFilters((f) => ({ ...f, sizes: toggle(f.sizes, s) }))}
              className={clsx(
                "min-w-[2.75rem] border px-2.5 py-2 text-xs uppercase tracking-[0.1em] transition",
                filters.sizes.includes(s)
                  ? "border-ink bg-ink text-ivory"
                  : "border-sand text-ink hover:border-ink"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Colour">
        <div className="flex flex-wrap gap-3">
          {allColors.map((c) => {
            const active = filters.colors.includes(c);
            return (
              <button
                key={c}
                title={titleCase(c)}
                aria-label={titleCase(c)}
                onClick={() => setFilters((f) => ({ ...f, colors: toggle(f.colors, c) }))}
                className={clsx(
                  "relative h-7 w-7 rounded-full border transition",
                  active ? "ring-2 ring-blue ring-offset-2 ring-offset-ivory border-transparent" : "border-sand"
                )}
                style={{ backgroundColor: COLOR_HEX[c] ?? "#cccccc" }}
              >
                {c === "multicolor" && (
                  <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#8c2f2f,#b8924a,#3a5d44,#3a5a8c,#5c3a6b,#8c2f2f)]" />
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <ul className="space-y-2.5">
          {allBrands.map((b) => (
            <li key={b}>
              <CheckRow
                checked={filters.brands.includes(b)}
                onChange={() => setFilters((f) => ({ ...f, brands: toggle(f.brands, b) }))}
              >
                {b}
              </CheckRow>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Price">
        <input
          type="range"
          min={0}
          max={priceMax}
          step={5000}
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="luxe-range w-full"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-stone">
          <span>{formatNaira(0)}</span>
          <span className="font-medium text-ink">Up to {formatNaira(filters.maxPrice)}</span>
        </div>
      </FilterSection>

      <FilterSection title="Offers">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm text-ink">On Sale only</span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.onSale}
            onClick={() => setFilters((f) => ({ ...f, onSale: !f.onSale }))}
            className={clsx(
              "relative h-6 w-11 rounded-full transition",
              filters.onSale ? "bg-blue" : "bg-sand"
            )}
          >
            <span
              className={clsx(
                "absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-sm transition",
                filters.onSale ? "left-[1.45rem]" : "left-0.5"
              )}
            />
          </button>
        </label>
      </FilterSection>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <div className="mb-6 flex items-center justify-between border-b border-sand pb-4">
            <h2 className="font-serif text-xl text-ink">Filters</h2>
            {activeChips.length > 0 && (
              <button onClick={clearAll} className="text-[0.7rem] uppercase tracking-[0.15em] text-stone hover:text-blue-deep">
                Clear all
              </button>
            )}
          </div>
          {sidebar}
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand pb-4">
          <p className="text-sm text-stone">
            <span className="font-medium text-ink">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "piece" : "pieces"}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 border border-ink/30 px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.15em] text-ink transition hover:bg-ink hover:text-ivory lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
              {activeChips.length > 0 && (
                <span className="ml-1 rounded-full bg-blue px-1.5 text-[0.65rem] text-white">{activeChips.length}</span>
              )}
            </button>
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="appearance-none border border-ink/30 bg-paper py-2.5 pl-4 pr-10 text-[0.7rem] uppercase tracking-[0.15em] text-ink outline-none transition hover:border-ink focus:border-ink"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone" />
            </div>
          </div>
        </div>

        {/* Active chips */}
        {activeChips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                onClick={chip.clear}
                className="flex items-center gap-1.5 rounded-full border border-sand bg-cream px-3 py-1.5 text-xs text-ink transition hover:border-ink"
              >
                {chip.label}
                <X size={12} className="text-stone" />
              </button>
            ))}
            <button onClick={clearAll} className="ml-1 text-xs uppercase tracking-[0.12em] text-stone underline-offset-2 hover:text-blue-deep hover:underline">
              Clear all
            </button>
          </div>
        )}

        {/* Grid / empty */}
        <div className="mt-8">
          {filtered.length > 0 ? (
            <ProductGrid products={filtered} priorityCount={4} />
          ) : (
            <div className="flex flex-col items-center justify-center border border-dashed border-sand bg-cream/40 px-6 py-24 text-center">
              <p className="eyebrow mb-3">No matches</p>
              <h3 className="font-serif text-2xl text-ink">Nothing fits these filters</h3>
              <p className="mt-3 max-w-sm text-sm text-stone">
                Try adjusting your selection or clearing a few filters to discover more from the
                Luxe collection.
              </p>
              <Button variant="primary" className="mt-7" onClick={clearAll}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-ivory shadow-2xl">
            <div className="flex items-center justify-between border-b border-sand px-5 py-5">
              <h2 className="font-serif text-xl text-ink">Filters</h2>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="text-ink">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{sidebar}</div>
            <div className="grid grid-cols-2 gap-3 border-t border-sand px-5 py-4">
              <Button variant="outline" onClick={clearAll}>
                Clear
              </Button>
              <Button variant="primary" onClick={() => setDrawerOpen(false)}>
                Show {filtered.length}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-stone">{title}</h3>
      {children}
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex w-full cursor-pointer items-center gap-3 text-sm text-ink">
      <span
        className={clsx(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition",
          checked ? "border-ink bg-ink text-ivory" : "border-sand"
        )}
        onClick={(e) => {
          e.preventDefault();
          onChange();
        }}
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </span>
      <span className="flex-1" onClick={onChange}>
        {children}
      </span>
    </label>
  );
}
