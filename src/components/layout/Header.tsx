"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function Header() {

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-md">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Remote Recordings
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link href="/login">
            <Button variant="ghost" size="icon" className="rounded-full cursor-pointer w-9 h-9">
              <User className="w-6 h-6 text-muted-foreground" />
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-full cursor-pointer w-9 h-9 text-destructive hover:bg-destructive/10">
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}


