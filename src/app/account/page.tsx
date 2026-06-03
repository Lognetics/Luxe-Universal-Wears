"use client";

import { Suspense, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import {
  User,
  Package,
  Heart,
  MapPin,
  Ruler,
  Scissors,
  RefreshCw,
  Award,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProduct } from "@/lib/catalog";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/lib/types";

import {
  Card,
  EmptyState,
  FormField,
  InlineNotice,
  SectionTitle,
  StatusBadge,
} from "./components/shared";
import {
  MOCK_ADDRESSES,
  MOCK_MEASUREMENTS,
  MOCK_ORDERS,
  MOCK_RETURNS,
  MOCK_TAILORING,
  REWARDS,
  TIER_THRESHOLD,
  type Address,
  type Measurements,
} from "./mock-data";

type TabId =
  | "overview"
  | "profile"
  | "orders"
  | "wishlist"
  | "addresses"
  | "measurements"
  | "tailoring"
  | "returns"
  | "rewards";

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "overview", label: "Overview", icon: Settings },
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "measurements", label: "Measurements", icon: Ruler },
  { id: "tailoring", label: "Tailoring", icon: Scissors },
  { id: "returns", label: "Returns", icon: RefreshCw },
  { id: "rewards", label: "Rewards", icon: Award },
];

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="eyebrow text-mist">Loading your account…</p>
        </div>
      }
    >
      <AccountInner />
    </Suspense>
  );
}

function AccountInner() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const wishlistStore = useStore().wishlist;

  const initialTab = (searchParams.get("tab") as TabId) || "overview";
  const [tab, setTab] = useState<TabId>(
    TABS.some((t) => t.id === initialTab) ? initialTab : "overview"
  );

  const wishlistProducts = useMemo<Product[]>(
    () =>
      wishlistStore
        .map((id) => getProduct(id))
        .filter((p): p is Product => Boolean(p)),
    [wishlistStore]
  );

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  // ---- Loading / gate states ----
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="eyebrow text-mist">Loading your account…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Container className="py-24" width="narrow">
        <div className="border border-sand bg-paper p-10 text-center shadow-soft sm:p-16">
          <p className="eyebrow mb-3">Members&apos; Atelier</p>
          <h1 className="text-4xl text-ink sm:text-5xl">Your Account Awaits</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone">
            Sign in to view your orders, manage bespoke measurements, and enjoy
            the privileges of Luxe Membership.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/login" size="lg">
              Sign In
            </ButtonLink>
            <ButtonLink href="/register" variant="outline" size="lg">
              Create Account
            </ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  const displayName = user.name || user.email.split("@")[0];

  return (
    <Container className="py-12 sm:py-16" width="wide">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 border-b border-sand pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">My Account</p>
          <h1 className="text-4xl text-ink sm:text-5xl">{displayName}</h1>
          <p className="mt-1 text-sm text-stone">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-blue/40 bg-blue/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-blue-deep">
            <Award className="h-4 w-4" /> {REWARDS.tier} Member
          </span>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside>
          <nav className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={clsx(
                  "flex shrink-0 items-center gap-3 px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors",
                  tab === id
                    ? "bg-ink text-ivory"
                    : "text-charcoal hover:bg-cream"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="mt-2 flex shrink-0 items-center gap-3 border-t border-sand px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-danger transition-colors hover:bg-danger/5 lg:mt-4"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main panel */}
        <main className="min-w-0 animate-fade-up">
          {tab === "overview" && (
            <OverviewSection name={displayName} wishlistCount={wishlistProducts.length} onNavigate={setTab} />
          )}
          {tab === "profile" && <ProfileSection email={user.email} name={displayName} />}
          {tab === "orders" && <OrdersSection />}
          {tab === "wishlist" && <WishlistSection products={wishlistProducts} />}
          {tab === "addresses" && <AddressesSection />}
          {tab === "measurements" && <MeasurementsSection />}
          {tab === "tailoring" && <TailoringSection />}
          {tab === "returns" && <ReturnsSection />}
          {tab === "rewards" && <RewardsSection />}
        </main>
      </div>
    </Container>
  );
}

/* ============================ Overview ============================ */

function OverviewSection({
  name,
  wishlistCount,
  onNavigate,
}: {
  name: string;
  wishlistCount: number;
  onNavigate: (t: TabId) => void;
}) {
  const recent = MOCK_ORDERS[0];
  const stats = [
    { label: "Orders", value: MOCK_ORDERS.length, icon: Package },
    { label: "Wishlist", value: wishlistCount, icon: Heart },
    { label: "Reward Points", value: REWARDS.points.toLocaleString(), icon: Award },
    { label: "Membership", value: REWARDS.tier, icon: Settings },
  ];

  return (
    <div className="space-y-10">
      <div>
        <SectionTitle eyebrow="Dashboard" title={`Welcome back, ${name}.`} description="Here is a snapshot of your wardrobe and membership." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="flex flex-col gap-3">
              <Icon className="h-5 w-5 text-blue-deep" />
              <div>
                <p className="font-serif text-3xl text-ink">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone">{label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl text-ink">Most Recent Order</h3>
          <button
            onClick={() => onNavigate("orders")}
            className="luxe-link-underline text-xs uppercase tracking-[0.18em] text-blue-deep"
          >
            View all orders
          </button>
        </div>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand pb-4">
            <div>
              <p className="text-sm font-medium text-ink">{recent.id}</p>
              <p className="text-xs text-stone">{recent.date}</p>
            </div>
            <StatusBadge status={recent.status} />
          </div>
          <ul className="mt-4 space-y-2">
            {recent.items.map((it) => (
              <li key={it.name} className="flex justify-between text-sm text-charcoal">
                <span>
                  {it.name} <span className="text-mist">×{it.qty}</span>
                </span>
                <span>{formatNaira(it.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-sand pt-4">
            <span className="text-xs uppercase tracking-[0.18em] text-stone">Total</span>
            <span className="font-serif text-xl text-ink">{formatNaira(recent.total)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================ Profile ============================ */

function ProfileSection({ email, name }: { email: string; name: string }) {
  const [form, setForm] = useState({
    name,
    email,
    phone: "+234 802 114 5566",
    currentPassword: "",
    newPassword: "",
  });
  const [saved, setSaved] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <div>
      <SectionTitle eyebrow="Personal" title="Profile Details" description="Keep your contact and security information up to date." />
      <Card>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Full Name" id="p-name" value={form.name} onChange={(v) => update("name", v)} />
            <FormField label="Email" id="p-email" type="email" value={form.email} onChange={(v) => update("email", v)} />
            <FormField label="Phone" id="p-phone" value={form.phone} onChange={(v) => update("phone", v)} />
          </div>

          <div className="border-t border-sand pt-6">
            <p className="eyebrow mb-4">Change Password</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField label="Current Password" id="p-cur" type="password" value={form.currentPassword} onChange={(v) => update("currentPassword", v)} placeholder="••••••••" />
              <FormField label="New Password" id="p-new" type="password" value={form.newPassword} onChange={(v) => update("newPassword", v)} placeholder="••••••••" />
            </div>
          </div>

          {saved && <InlineNotice message="Your profile has been updated." />}

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ============================ Orders ============================ */

function OrdersSection() {
  const { addToCart, notify } = useStore();
  const [expanded, setExpanded] = useState<string | null>(MOCK_ORDERS[0]?.id ?? null);

  function reorder(orderId: string) {
    const order = MOCK_ORDERS.find((o) => o.id === orderId);
    if (!order) return;
    let added = 0;
    order.items.forEach((it) => {
      if (it.slug) {
        const product = getProduct(it.slug);
        if (product) {
          addToCart(product, { quantity: it.qty });
          added += 1;
        }
      }
    });
    if (added === 0) notify("These pieces are no longer available to reorder.");
  }

  return (
    <div>
      <SectionTitle eyebrow="History" title="Your Orders" description="Track, review, and reorder your past purchases." />
      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => {
          const open = expanded === order.id;
          return (
            <Card key={order.id} className="p-0">
              <button
                onClick={() => setExpanded(open ? null : order.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-6 text-left"
              >
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <span className="text-sm font-medium text-ink">{order.id}</span>
                  <span className="text-xs text-stone">{order.date}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-serif text-lg text-ink">{formatNaira(order.total)}</span>
                  <ChevronDown
                    className={clsx("h-4 w-4 text-stone transition-transform", open && "rotate-180")}
                  />
                </div>
              </button>

              {open && (
                <div className="border-t border-sand p-6">
                  <ul className="space-y-3">
                    {order.items.map((it) => (
                      <li key={it.name} className="flex justify-between text-sm text-charcoal">
                        <span>
                          {it.slug ? (
                            <Link href={`/product/${it.slug}`} className="luxe-link-underline">
                              {it.name}
                            </Link>
                          ) : (
                            it.name
                          )}{" "}
                          <span className="text-mist">×{it.qty}</span>
                        </span>
                        <span>{formatNaira(it.price)}</span>
                      </li>
                    ))}
                  </ul>
                  {order.tracking && (
                    <p className="mt-4 text-xs text-stone">
                      Tracking: <span className="text-charcoal">{order.tracking}</span>
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button size="sm" variant="outline" onClick={() => reorder(order.id)}>
                      Reorder
                    </Button>
                    {order.status !== "Delivered" && (
                      <Button size="sm" variant="ghost" onClick={() => notify(`Tracking ${order.id}…`)}>
                        Track Shipment
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ Wishlist ============================ */

function WishlistSection({ products }: { products: Product[] }) {
  return (
    <div>
      <SectionTitle eyebrow="Saved" title="Your Wishlist" description="Pieces you have set aside for a future occasion." />
      {products.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Browse the collections and tap the heart on any piece to keep it here."
          action={<ButtonLink href="/shop">Explore the Collection</ButtonLink>}
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

/* ============================ Addresses ============================ */

function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  const blank: Address = {
    id: "",
    label: "Home",
    recipient: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    isDefault: false,
  };

  function startAdd() {
    setEditing(blank);
    setShowForm(true);
  }
  function startEdit(addr: Address) {
    setEditing(addr);
    setShowForm(true);
  }
  function remove(id: string) {
    setAddresses((list) => list.filter((a) => a.id !== id));
  }
  function save(addr: Address) {
    setAddresses((list) => {
      if (addr.id) return list.map((a) => (a.id === addr.id ? addr : a));
      return [...list, { ...addr, id: `addr-${Date.now()}` }];
    });
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div>
      <SectionTitle eyebrow="Delivery" title="Saved Addresses" description="Manage where your orders are delivered across Nigeria." />

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <Card key={addr.id} className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-charcoal">
                {addr.label}
              </span>
              {addr.isDefault && (
                <span className="border border-blue/40 bg-blue/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-blue-deep">
                  Default
                </span>
              )}
            </div>
            <div className="mt-3 space-y-0.5 text-sm text-charcoal">
              <p className="font-medium text-ink">{addr.recipient}</p>
              <p>{addr.street}</p>
              <p>
                {addr.city}, {addr.state}
              </p>
              <p className="text-stone">{addr.phone}</p>
            </div>
            <div className="mt-auto flex gap-3 pt-5">
              <button
                onClick={() => startEdit(addr)}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-charcoal luxe-link-underline"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => remove(addr.id)}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-danger luxe-link-underline"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </Card>
        ))}

        <button
          onClick={startAdd}
          className="flex min-h-[180px] items-center justify-center gap-2 border border-dashed border-sand text-xs uppercase tracking-[0.18em] text-stone transition-colors hover:border-blue hover:text-blue-deep"
        >
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {showForm && editing && (
        <AddressForm
          initial={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={save}
        />
      )}
    </div>
  );
}

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Address;
  onSave: (a: Address) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Address>(initial);
  function set<K extends keyof Address>(key: K, value: Address[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  return (
    <Card className="mt-6">
      <h3 className="mb-5 text-2xl text-ink">{initial.id ? "Edit Address" : "Add Address"}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Label" id="a-label" value={form.label} onChange={(v) => set("label", v)} placeholder="Home / Office" />
          <FormField label="Recipient" id="a-recipient" value={form.recipient} onChange={(v) => set("recipient", v)} placeholder="Full name" />
          <FormField label="Phone" id="a-phone" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+234 ..." />
          <FormField label="City" id="a-city" value={form.city} onChange={(v) => set("city", v)} placeholder="Lagos" />
          <FormField label="State" id="a-state" value={form.state} onChange={(v) => set("state", v)} placeholder="Lagos State" />
        </div>
        <FormField label="Street Address" id="a-street" value={form.street} onChange={(v) => set("street", v)} placeholder="House no, street, area" />
        <label className="flex cursor-pointer items-center gap-2 text-xs text-stone select-none">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => set("isDefault", e.target.checked)}
            className="h-4 w-4 accent-blue"
          />
          Set as default delivery address
        </label>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Address</Button>
        </div>
      </form>
    </Card>
  );
}

/* ============================ Measurements ============================ */

const MEASURE_LABELS: { key: keyof Measurements; label: string }[] = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "sleeve", label: "Sleeve" },
  { key: "inseam", label: "Inseam" },
  { key: "neck", label: "Neck" },
  { key: "shoulder", label: "Shoulder" },
];

function MeasurementsSection() {
  const [data, setData] = useState<Measurements>(MOCK_MEASUREMENTS);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Measurements>(MOCK_MEASUREMENTS);
  const [saved, setSaved] = useState(false);

  function startEdit() {
    setDraft(data);
    setEditing(true);
    setSaved(false);
  }
  function save(e: FormEvent) {
    e.preventDefault();
    setData(draft);
    setEditing(false);
    setSaved(true);
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Bespoke"
        title="Your Measurements"
        description="We keep your measurements on file so every bespoke commission fits as it should — the first time, every time."
      />

      {saved && !editing && (
        <div className="mb-4">
          <InlineNotice message="Measurement profile saved." />
        </div>
      )}

      <Card>
        {!editing ? (
          <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {MEASURE_LABELS.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone">{label}</p>
                  <p className="mt-1 font-serif text-2xl text-ink">{data[key]}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-sand pt-6">
              <p className="max-w-md text-xs leading-relaxed text-stone">
                Ready for a new commission? Our atelier will reference this
                profile for your next bespoke garment.
              </p>
              <div className="flex gap-3">
                <ButtonLink href="/shop" variant="ghost" size="sm">
                  Book Bespoke
                </ButtonLink>
                <Button size="sm" variant="outline" onClick={startEdit}>
                  Edit
                </Button>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={save} className="space-y-6">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {MEASURE_LABELS.map(({ key, label }) => (
                <FormField
                  key={key}
                  id={`m-${key}`}
                  label={label}
                  value={draft[key]}
                  onChange={(v) => setDraft((d) => ({ ...d, [key]: v }))}
                />
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Measurements</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

/* ============================ Tailoring ============================ */

function TailoringSection() {
  return (
    <div>
      <SectionTitle
        eyebrow="Atelier"
        title="Tailoring Requests"
        description="Follow the progress of your bespoke commissions and consultations."
      />
      <div className="space-y-4">
        {MOCK_TAILORING.map((req) => (
          <Card key={req.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{req.garment}</p>
                <p className="mt-1 text-xs text-stone">
                  {req.id} · {req.date}
                </p>
              </div>
              <StatusBadge status={req.status} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-charcoal">{req.notes}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <ButtonLink href="/shop" variant="outline">
          Request New Commission
        </ButtonLink>
      </div>
    </div>
  );
}

/* ============================ Returns ============================ */

function ReturnsSection() {
  const [form, setForm] = useState({ order: "", item: "", reason: "" });
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setForm({ order: "", item: "", reason: "" });
  }

  return (
    <div className="space-y-10">
      <div>
        <SectionTitle
          eyebrow="Aftercare"
          title="Request a Return"
          description="Items may be returned within 14 days of delivery, unworn and with tags attached."
        />
        <Card>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="r-order" className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-charcoal">
                  Order Number
                </label>
                <select
                  id="r-order"
                  required
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                  className="w-full border border-sand bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-blue"
                >
                  <option value="">Select an order</option>
                  {MOCK_ORDERS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} — {o.date}
                    </option>
                  ))}
                </select>
              </div>
              <FormField
                label="Item"
                id="r-item"
                value={form.item}
                onChange={(v) => setForm((f) => ({ ...f, item: v }))}
                placeholder="Which piece?"
              />
            </div>
            <div>
              <label htmlFor="r-reason" className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-charcoal">
                Reason
              </label>
              <textarea
                id="r-reason"
                required
                rows={3}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Tell us a little about why you're returning this item."
                className="w-full border border-sand bg-paper px-4 py-3 text-sm text-ink outline-none placeholder:text-mist focus:border-blue"
              />
            </div>
            {submitted && <InlineNotice message="Return request received — we'll be in touch by email." />}
            <div className="flex justify-end">
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 text-2xl text-ink">Return History</h3>
        <div className="space-y-4">
          {MOCK_RETURNS.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{r.item}</p>
                  <p className="mt-1 text-xs text-stone">
                    {r.id} · Order {r.order} · {r.date}
                  </p>
                  <p className="mt-2 text-sm text-charcoal">{r.reason}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================ Rewards ============================ */

function RewardsSection() {
  const progress = Math.min(100, Math.round((REWARDS.points / TIER_THRESHOLD) * 100));
  return (
    <div>
      <SectionTitle
        eyebrow="Luxe Membership"
        title="Your Rewards"
        description="Earn points with every purchase and unlock the privileges of higher tiers."
      />

      <Card className="bg-ink text-ivory">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-blue-soft">Points Balance</p>
            <p className="font-serif text-5xl text-ivory">{REWARDS.points.toLocaleString()}</p>
          </div>
          <span className="inline-flex items-center gap-2 border border-blue/50 bg-blue/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-blue-soft">
            <Award className="h-4 w-4" /> {REWARDS.tier} Tier
          </span>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex justify-between text-xs uppercase tracking-[0.18em] text-ivory/70">
            <span>{REWARDS.tier}</span>
            <span>{REWARDS.nextTier}</span>
          </div>
          <div className="h-1.5 w-full bg-ivory/15">
            <div className="h-full bg-blue" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-xs text-ivory/70">
            {REWARDS.pointsToNext.toLocaleString()} points to reach {REWARDS.nextTier} status.
          </p>
        </div>
      </Card>

      <div className="mt-6">
        <h3 className="mb-4 text-2xl text-ink">Your Perks</h3>
        <Card>
          <ul className="space-y-4">
            {REWARDS.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm text-charcoal">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-blue" />
                {perk}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
