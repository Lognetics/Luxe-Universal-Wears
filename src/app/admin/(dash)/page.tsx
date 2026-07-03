import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/ssr";
import { PublishButton } from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const sb = await getSupabaseServerClient();
  const [{ count: products }, { count: categories }] = await Promise.all([
    sb!.from("products").select("id", { count: "exact", head: true }),
    sb!.from("categories").select("slug", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Edit products, prices, images and categories. Then publish to update the live store.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <Link href="/admin/products" className="rounded-2xl bg-white p-5 shadow-sm hover:shadow">
          <div className="text-3xl font-semibold">{products ?? 0}</div>
          <div className="text-sm text-neutral-500">Products</div>
        </Link>
        <Link href="/admin/categories" className="rounded-2xl bg-white p-5 shadow-sm hover:shadow">
          <div className="text-3xl font-semibold">{categories ?? 0}</div>
          <div className="text-sm text-neutral-500">Categories</div>
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-[var(--color-blue,#0098d8)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-semibold">Publish changes</h2>
        <p className="mb-4 mt-1 text-sm text-neutral-500">
          Your edits are saved instantly to the catalog. Click publish to push them to the
          public website (luxeuniversalwears.com).
        </p>
        <PublishButton />
      </div>
    </div>
  );
}
