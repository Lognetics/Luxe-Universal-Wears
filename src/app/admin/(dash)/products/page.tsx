import { fetchNeticsCatalogue, siteRelative } from "@/lib/netics";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

const NETICS_CONSOLE = (
  process.env.NEXT_PUBLIC_NETICS_API_BASE?.trim() || "https://business.neticsai.com"
).replace(/\/+$/, "");

/**
 * What NETICS holds for this shop, read-only. Editing happens in the NETICS
 * console; this page exists so the team can see the catalogue the site will
 * publish without leaving the admin.
 */
export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let products: Awaited<ReturnType<typeof fetchNeticsCatalogue>> = [];
  let problem: string | null = null;
  try {
    products = (await fetchNeticsCatalogue()).filter((item) => item.is_active);
  } catch (error) {
    problem = error instanceof Error ? error.message : "NETICS could not be reached.";
  }
  const term = (q ?? "").trim().toLowerCase();
  const rows = term
    ? products.filter((p) => `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(term))
    : products;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Managed in NETICS. Changes there reach the live site within a couple of minutes.
          </p>
        </div>
        <a
          href={`${NETICS_CONSOLE}/app/products`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-[var(--color-blue-deep,#006b9b)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Add or edit in NETICS
        </a>
      </div>

      <form className="mt-5" action="/admin/products">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search products by name, SKU or category…"
          className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-blue,#0098d8)]"
        />
      </form>

      {problem && (
        <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{problem}</p>
      )}

      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 text-left text-neutral-500">
            <tr>
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Labels</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const cover = p.images?.[0] || p.image_url;
              return (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-neutral-100">
                        {cover && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={siteRelative(cover)}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{p.name}</div>
                        {p.sku && <div className="text-xs text-neutral-500">{p.sku}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-neutral-600">{p.category || "–"}</td>
                  <td className="p-3">
                    {formatNaira(p.price)}
                    {p.compare_price && p.compare_price > p.price && (
                      <span className="ml-2 text-xs text-neutral-400 line-through">
                        {formatNaira(p.compare_price)}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-neutral-600">
                    {p.in_stock ? (p.stock_level ?? "In stock") : "Out of stock"}
                  </td>
                  <td className="p-3 text-neutral-600">
                    {(p.badges ?? []).map((badge) => badge.replace("_", " ")).join(", ") || "–"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length && !problem && (
          <p className="p-6 text-center text-sm text-neutral-500">
            No products found. Add them in NETICS and they appear here.
          </p>
        )}
      </div>
    </div>
  );
}
