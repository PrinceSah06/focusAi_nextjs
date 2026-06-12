"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { Button } from "../ui/button";

const Sidebar = () => {
  const path = usePathname();

  const links = [
    { href: "/home", label: "Home", icon: CheckSquare },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/dashboard", label: "Dashboard", icon: CheckSquare },
    { href: "/schedule", label: "Schedule", icon: CheckSquare },
    { href: "/stats", label: "Stats", icon: CheckSquare },
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

      <Button variant="destructive">
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;