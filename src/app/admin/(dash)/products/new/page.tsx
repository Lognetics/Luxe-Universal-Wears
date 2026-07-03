import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/ssr";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const sb = await getSupabaseServerClient();
  const { data: categories } = await sb!
    .from("categories")
    .select("slug, name, \"group\"")
    .order("sort_order");

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-neutral-500 hover:underline">
        ← Products
      </Link>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Add product</h1>
      <div className="mt-6">
        <ProductForm categories={(categories ?? []) as { slug: string; name: string; group: string }[]} />
      </div>
    </div>
  );
}
