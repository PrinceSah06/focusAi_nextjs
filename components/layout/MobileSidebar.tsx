import React from 'react'
import {Menu} from 'lucide-react'
import {Sheet ,SheetContent,SheetTrigger} from "@/components/ui/sheet"
import Link from 'next/link';
const MobileSidebar = () => {
    const links = [
  { href: "/home", label: "Home" },
  { href: "/tasks", label: "Tasks" },
  { href: "/schedule", label: "Schedule" },
  { href: "/stats", label: "Stats" },
];
  return (
  <Sheet>
    <SheetTrigger>
        <Menu/>
    </SheetTrigger>
   <SheetContent side="left">
  <div className="flex flex-col gap-4 mt-8">
    {links.map((link) => (
      <Link key={link.href} href={link.href}>
        {link.label}
      </Link>
    ))}
  </div>
</SheetContent>
  </Sheet>
  )
}

export default MobileSidebar
