"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Map, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", icon: Map, label: "Поездки" },
    { href: "/trips/new", icon: PlusCircle, label: "Создать" },
    { href: "/settings", icon: Settings, label: "Настройки" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/5 rounded-t-2xl">
      <nav className="flex justify-around items-center h-20 pb-4">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-full transition-all duration-300",
                isActive ? "bg-primary/20" : "bg-transparent"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
