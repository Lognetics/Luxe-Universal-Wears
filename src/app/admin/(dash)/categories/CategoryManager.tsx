"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveCategory, deleteCategory } from "@/app/admin/actions";

type Cat = { slug: string; name: string; group: string; subcategories: string[]; count: number };
const GROUPS = ["Clothing", "Suits", "Footwear", "Accessories"];

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [group, setGroup] = useState(GROUPS[0]);
  const [subs, setSubs] = useState("");

  function add(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    start(async () => {
      try {
        await saveCategory({
          name,
          group,
          subcategories: subs.split(",").map((s) => s.trim()).filter(Boolean),
        });
        setName("");
        setSubs("");
        router.refresh();
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to add category.");
      }
    });
  }

  function remove(slug: string) {
    setErr(null);
    start(async () => {
      if (!confirm(`Delete category "${slug}"?`)) return;
      try {
        await deleteCategory(slug);
        router.refresh();
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to delete.");
      }
    });
  }

  const input =
    "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-blue,#0098d8)]";

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <form onSubmit={add} className="rounded-2xl bg-white p-5 shadow-sm md:col-span-1">
        <h2 className="font-serif text-lg font-semibold">Add category</h2>
        <input className={`${input} mt-3 w-full`} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <select className={`${input} mt-3 w-full`} value={group} onChange={(e) => setGroup(e.target.value)}>
          {GROUPS.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <input
          className={`${input} mt-3 w-full`}
          placeholder="Subcategories (comma-sep)"
          value={subs}
          onChange={(e) => setSubs(e.target.value)}
        />
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-lg bg-[var(--color-blue,#0098d8)] py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          Add category
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm md:col-span-2">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 text-left text-neutral-500">
            <tr>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Group</th>
              <th className="p-3 font-medium">Products</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.slug} className="border-b border-neutral-100 last:border-0">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-neutral-600">{c.group}</td>
                <td className="p-3 text-neutral-600">{c.count}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => remove(c.slug)}
                    disabled={pending || c.count > 0}
                    className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-neutral-300"
                    title={c.count > 0 ? "Move products out first" : "Delete"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
