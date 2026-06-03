"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { NAV } from "@/lib/nav";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/components/providers/StoreProvider";
import { AnnouncementBar } from "./AnnouncementBar";
import { SearchOverlay } from "./SearchOverlay";

export function Header() {
  const { cartCount, wishlistCount, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMega(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[80] w-full">
      <AnnouncementBar />
      <div
        className={`w-full border-b transition-all duration-300 ${
          scrolled ? "border-sand bg-ivory/95 backdrop-blur-md" : "border-transparent bg-ivory"
        }`}
        onMouseLeave={() => setOpenMega(null)}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu size={24} />
          </button>

          {/* Left nav (desktop) */}
          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <div key={item.label} onMouseEnter={() => setOpenMega(item.mega ? item.label : null)}>
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-[0.78rem] uppercase tracking-[0.16em] text-ink transition hover:text-blue-deep"
                >
                  {item.label}
                  {item.mega && <ChevronDown size={12} className="text-mist" />}
                </Link>
              </div>
            ))}
          </nav>

          {/* Logo */}
          <Link href="/" aria-label="Luxe Universal Wears — home" className="flex shrink-0 items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <Logo priority className="h-12 w-auto sm:h-14" />
          </Link>

          {/* Right icons */}
          <div className="flex flex-1 items-center justify-end gap-4 sm:gap-5">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="hidden text-ink hover:text-blue-deep sm:block">
              <Search size={20} />
            </button>
            <Link href="/account" aria-label="Account" className="hidden text-ink hover:text-blue-deep sm:block">
              <User size={20} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative text-ink hover:text-blue-deep">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[0.6rem] text-ivory">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} aria-label="Cart" className="relative text-ink hover:text-blue-deep">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue px-1 text-[0.6rem] text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menu panel */}
        {NAV.map((item) =>
          item.mega ? (
            <div
              key={item.label}
              onMouseEnter={() => setOpenMega(item.label)}
              className={`absolute inset-x-0 top-full hidden border-b border-sand bg-ivory shadow-soft lg:block ${
                openMega === item.label ? "opacity-100" : "pointer-events-none opacity-0"
              } transition-opacity duration-200`}
            >
              <div className="mx-auto grid max-w-[1320px] grid-cols-[1fr_1fr_1fr_1.3fr] gap-10 px-8 py-10">
                {item.mega.map((col) => (
                  <div key={col.title}>
                    <p className="eyebrow mb-4">{col.title}</p>
                    <ul className="space-y-2.5">
                      {col.links.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href} className="text-[0.95rem] text-stone transition hover:text-ink luxe-link-underline">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {item.feature && (
                  <Link href={item.feature.href} className="group relative overflow-hidden">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
                      <Image src={item.feature.image} alt={item.feature.title} fill sizes="320px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                      <div className="absolute bottom-0 p-5 text-ivory">
                        <p className="font-serif text-xl">{item.feature.title}</p>
                        <p className="mt-1 text-xs text-ivory/80">{item.feature.text}</p>
                        <span className="mt-2 inline-block text-[0.65rem] uppercase tracking-[0.2em] text-blue-soft">Discover →</span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ) : null
        )}
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} onSearch={() => { setMobileOpen(false); setSearchOpen(true); }} />
    </header>
  );
}

function MobileNav({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 z-[90] bg-ink/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed left-0 top-0 z-[95] h-full w-[85%] max-w-sm overflow-y-auto bg-ivory transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-sand px-6 py-5">
          <span className="font-serif text-xl">Menu</span>
          <button onClick={onClose} aria-label="Close menu"><X size={22} /></button>
        </div>
        <button onClick={onSearch} className="flex w-full items-center gap-3 border-b border-sand px-6 py-4 text-stone">
          <Search size={18} /> Search products
        </button>
        <nav className="px-2 py-2">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-sand/60">
              {item.mega ? (
                <>
                  <button onClick={() => setExpanded(expanded === item.label ? null : item.label)} className="flex w-full items-center justify-between px-4 py-3.5 text-sm uppercase tracking-wider">
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform ${expanded === item.label ? "rotate-180" : ""}`} />
                  </button>
                  {expanded === item.label && (
                    <div className="bg-cream/50 px-4 pb-3">
                      {item.mega.flatMap((c) => c.links).map((l) => (
                        <Link key={l.label} href={l.href} onClick={onClose} className="block py-2 text-sm text-stone">
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} onClick={onClose} className="block px-4 py-3.5 text-sm uppercase tracking-wider">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div className="flex gap-4 px-6 py-5">
          <Link href="/account" onClick={onClose} className="flex items-center gap-2 text-sm text-stone"><User size={18} /> Account</Link>
        </div>
      </aside>
    </>
  );
}
