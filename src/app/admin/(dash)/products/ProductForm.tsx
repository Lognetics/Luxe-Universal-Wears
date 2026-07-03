"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveProduct, deleteProduct, uploadProductImage } from "@/app/admin/actions";
import type { Product } from "@/lib/types";

type CatOpt = { slug: string; name: string; group: string };

const list = (s: string) =>
  s.split(",").map((x) => x.trim()).filter(Boolean);

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: CatOpt[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    category: product?.category ?? categories[0]?.slug ?? "",
    brand: product?.brand ?? "Luxe Universal",
    price: product?.price ?? 0,
    comparePrice: product?.comparePrice ?? "",
    subcategory: product?.subcategory ?? "",
    description: product?.description ?? "",
    colors: (product?.colors ?? []).join(", "),
    sizes: (product?.sizes ?? []).join(", "),
    tags: (product?.tags ?? []).join(", "),
    stock: product?.stock ?? 12,
    isNew: product?.isNew ?? true,
    isBestSeller: product?.isBestSeller ?? false,
    isFeatured: product?.isFeatured ?? false,
  });

  const set = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setErr(null);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.set("file", file);
        const url = await uploadProductImage(fd);
        setImages((prev) => [...prev, url]);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    start(async () => {
      try {
        const { id } = await saveProduct({
          id: product?.id,
          slug: product?.slug,
          name: form.name,
          category: form.category,
          brand: form.brand,
          price: Number(form.price) || 0,
          comparePrice: form.comparePrice === "" ? null : Number(form.comparePrice),
          subcategory: form.subcategory,
          description: form.description,
          colors: list(form.colors),
          sizes: list(form.sizes),
          tags: list(form.tags),
          stock: Number(form.stock) || 0,
          images,
          isNew: form.isNew,
          isBestSeller: form.isBestSeller,
          isFeatured: form.isFeatured,
        });
        router.push(`/admin/products/${id}?saved=1`);
        router.refresh();
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Save failed.");
      }
    });
  }

  const input =
    "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-blue,#0098d8)]";
  const label = "block text-sm font-medium text-neutral-700";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-3">
      {/* Left: images */}
      <div className="md:col-span-1">
        <label className={label}>Images</label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <div key={src + i} className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <label className="mt-3 inline-block cursor-pointer rounded-lg border border-dashed border-neutral-400 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
          {uploading ? "Uploading…" : "+ Upload image(s)"}
          <input type="file" accept="image/*" multiple hidden onChange={onUpload} disabled={uploading} />
        </label>
      </div>

      {/* Right: fields */}
      <div className="grid gap-4 md:col-span-2">
        <div>
          <label className={label}>Name</label>
          <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Category</label>
            <select className={input} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.group})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Brand</label>
            <input className={input} value={form.brand} onChange={(e) => set("brand", e.target.value)} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Price (₦)</label>
            <input type="number" className={input} value={form.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div>
            <label className={label}>Compare price (₦)</label>
            <input
              type="number"
              className={input}
              value={form.comparePrice}
              placeholder="optional"
              onChange={(e) => set("comparePrice", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Stock</label>
            <input type="number" className={input} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
        </div>

        <div>
          <label className={label}>Subcategory</label>
          <input className={input} value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} />
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea className={input} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Colors (comma-sep)</label>
            <input className={input} value={form.colors} onChange={(e) => set("colors", e.target.value)} />
          </div>
          <div>
            <label className={label}>Sizes (comma-sep)</label>
            <input className={input} value={form.sizes} onChange={(e) => set("sizes", e.target.value)} />
          </div>
          <div>
            <label className={label}>Tags (comma-sep)</label>
            <input className={input} value={form.tags} onChange={(e) => set("tags", e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-5 text-sm">
          {(["isNew", "isBestSeller", "isFeatured"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)} />
              {k === "isNew" ? "New arrival" : k === "isBestSeller" ? "Best seller" : "Featured"}
            </label>
          ))}
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-[var(--color-blue,#0098d8)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save product"}
          </button>
          {product && (
            <button
              type="button"
              onClick={() =>
                start(async () => {
                  if (!confirm("Delete this product?")) return;
                  try {
                    await deleteProduct(product.id);
                    router.push("/admin/products");
                    router.refresh();
                  } catch (e) {
                    setErr(e instanceof Error ? e.message : "Delete failed.");
                  }
                })
              }
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
