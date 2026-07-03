import Link from "next/link";
import Image from "next/image";
import { getSupabaseServerClient } from "@/lib/supabase/ssr";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const { q, cat } = await searchParams;
  const sb = await getSupabaseServerClient();

  let query = sb!
    .from("products")
    .select("id, name, category, category_name, price, compare_price, images, stock")
    .order("created_index", { ascending: false })
    .limit(500);
  if (q) query = query.ilike("name", `%${q}%`);
  if (cat) query = query.eq("category", cat);

  const { data: products } = await query;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-[var(--color-blue,#0098d8)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add product
        </Link>
      </div>

      <form className="mt-5" action="/admin/products">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search products by name…"
          className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-blue,#0098d8)]"
        />
      </form>

      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 text-left text-neutral-500">
            <tr>
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={p.id as string} className="border-b border-neutral-100 last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-neutral-100">
                      {(p.images as string[])?.[0] && (
                        <Image
                          src={(p.images as string[])[0]}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium">{p.name as string}</span>
                  </div>
                </td>
                <td className="p-3 text-neutral-600">{p.category_name as string}</td>
                <td className="p-3">{formatNaira(p.price as number)}</td>
                <td className="p-3 text-neutral-600">{p.stock as number}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-medium text-[var(--color-blue,#0098d8)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products?.length && (
          <p className="p-6 text-center text-sm text-neutral-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
