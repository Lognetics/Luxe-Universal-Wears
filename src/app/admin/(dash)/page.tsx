import Link from "next/link";
import { fetchNeticsCatalogue } from "@/lib/netics";
import { getSupabaseServerClient } from "@/lib/supabase/ssr";
import { PublishButton, SeedButton } from "./ui";

export const dynamic = "force-dynamic";

const NETICS_CONSOLE = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");

export default async function AdminDashboard() {
  const sb = await getSupabaseServerClient();
  const [{ count: categories }, catalogue] = await Promise.all([
    sb!.from("categories").select("slug", { count: "exact", head: true }),
    fetchNeticsCatalogue().catch(() => null),
  ]);
  const products = catalogue ? catalogue.filter((item) => item.is_active).length : null;
  const inStock = catalogue ? catalogue.filter((item) => item.is_active && item.in_stock).length : null;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Products live in NETICS. Add or edit them there and the live store shows the change on
        its next page view. Categories are still curated here.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <Link href="/admin/products" className="rounded-2xl bg-white p-5 shadow-sm hover:shadow">
          <div className="text-3xl font-semibold">{products ?? "–"}</div>
          <div className="text-sm text-neutral-500">
            Products in NETICS{inStock != null ? ` (${inStock} in stock)` : ""}
          </div>
        </Link>
        <Link href="/admin/categories" className="rounded-2xl bg-white p-5 shadow-sm hover:shadow">
          <div className="text-3xl font-semibold">{categories ?? 0}</div>
          <div className="text-sm text-neutral-500">Categories</div>
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`${NETICS_CONSOLE}/app/products`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-[var(--color-blue-deep,#006b9b)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Open products in NETICS
        </a>
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-semibold">Refresh</h2>
        <p className="mb-4 mt-1 text-sm text-neutral-500">
          The live site reads NETICS and refreshes itself whenever a product changes. Press this
          to refresh right now, for example after editing categories.
        </p>
        <PublishButton />
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white p-6">
        <h2 className="font-serif text-xl font-semibold">First-time move</h2>
        <p className="mb-4 mt-1 text-sm text-neutral-500">
          Only needed once: copy the old Supabase catalogue into NETICS with every picture,
          colour, size, was-price, label and stock count. Then publish from NETICS.
        </p>
        <SeedButton />
      </div>
    </div>
  );
}
