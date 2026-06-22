"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  ClipboardList, 
  LayoutDashboard, 
  Calendar, 
  Sparkles, 
  TrendingUp 
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../src/store/authStore";

const Sidebar = () => {
  const path = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const links = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/tasks", label: "Tasks", icon: ClipboardList },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/schedule", label: "AI Timeline", icon: Calendar },
    { href: "/genrate", label: "AI Generator", icon: Sparkles },
    { href: "/stats", label: "Statistics", icon: TrendingUp },
  ];

  return (
    <aside
      className="
        hidden md:flex
        h-auto
        w-64
        flex-col
        justify-between
        bg-slate-900
        text-white
        p-4
      "
    >
      <div>
        <h1 className="border-b pb-4 text-3xl font-bold">
          FocusAI
        </h1>

        <div className="mt-6 flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3
                  rounded-xl px-4 py-3
                  transition-colors
                  ${
                    path === link.href
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700"
                  }
                `}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;