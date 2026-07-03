import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/supabase/ssr";
import { isSupabaseServerConfigured } from "@/lib/supabase/server";
import { LogoutButton } from "./ui";

export default async function AdminDashLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseServerConfigured()) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-100 p-8 text-center">
        <div className="max-w-md">
          <h1 className="font-serif text-2xl font-semibold">Backend not configured</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then reload.
          </p>
        </div>
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!(await isCurrentUserAdmin())) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-100 p-8 text-center">
        <div className="max-w-md">
          <h1 className="font-serif text-2xl font-semibold">Not authorised</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {user.email} is not an admin. Ask for your email to be added to the allowlist.
          </p>
          <div className="mt-4"><LogoutButton /></div>
        </div>
      </div>
    );
  }

  const nav = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 text-ink">
      <aside className="fixed inset-y-0 left-0 w-56 border-r border-neutral-200 bg-white p-5 hidden md:flex md:flex-col">
        <Link href="/admin" className="font-serif text-lg font-semibold">
          Luxe Admin
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="rounded-lg px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100"
          >
            View live site ↗
          </Link>
        </nav>
        <div className="mt-auto pt-6">
          <p className="truncate text-xs text-neutral-400">{user.email}</p>
          <div className="mt-2"><LogoutButton /></div>
        </div>
      </aside>
      <main className="md:pl-56">
        <div className="mx-auto max-w-5xl p-6">{children}</div>
      </main>
    </div>
  );
}
