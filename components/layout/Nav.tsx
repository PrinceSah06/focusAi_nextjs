"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "../../src/store/authStore";
import MobileSidebar from "./MobileSidebar";

const links = [
  { href: "/home", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/genrate", label: "Ai Schedule" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">  
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="md:hidden">
  <MobileSidebar/>
</div>
        <Link href="/home" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-md bg-sky-600 text-sm font-bold text-white">
            F
          </span>
          <span className="text-base font-semibold text-zinc-950">FocusAI</span>
        </Link>

        <div className=" items-center gap-2 hidden md:flexe ">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-sky-50 text-sky-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="max-w-36 truncate text-sm text-zinc-600">
            {user?.name || "User"}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
