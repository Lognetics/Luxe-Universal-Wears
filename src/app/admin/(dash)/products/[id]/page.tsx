import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/ssr";
import { rowToProduct } from "@/lib/supabase/mappers";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const sb = await getSupabaseServerClient();

  const [{ data: row }, { data: categories }] = await Promise.all([
    sb!.from("products").select("*").eq("id", id).maybeSingle(),
    sb!.from("categories").select("slug, name, \"group\"").order("created_at"),
  ]);
  if (!row) notFound();

  const product = rowToProduct(row);

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-neutral-500 hover:underline">
        ← Products
      </Link>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="font-serif text-3xl font-semibold">{product.name}</h1>
        {saved && <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">Saved</span>}
      </div>
      <div className="mt-6">
        <ProductForm
          product={product}
          categories={(categories ?? []) as { slug: string; name: string; group: string }[]}
        />
      </div>
    </div>
  );
}
