import { getSupabaseServerClient } from "@/lib/supabase/ssr";
import { CategoryManager } from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const sb = await getSupabaseServerClient();
  const [{ data: cats }, { data: prods }] = await Promise.all([
    sb!.from("categories").select("*").order("sort_order"),
    sb!.from("products").select("category"),
  ]);

  const counts = new Map<string, number>();
  for (const p of prods ?? []) {
    const c = p.category as string;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }

  const categories = (cats ?? []).map((c) => ({
    slug: c.slug as string,
    name: c.name as string,
    group: c.group as string,
    subcategories: (c.subcategories as string[]) ?? [],
    count: counts.get(c.slug as string) ?? 0,
  }));

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Categories</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Add, rename or remove categories. A category must be empty before it can be deleted.
      </p>
      <div className="mt-6">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
