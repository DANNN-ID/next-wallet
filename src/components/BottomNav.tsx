"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, PieChart, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Transaksi", href: "/transactions", icon: PieChart },
    { name: "Dompet", href: "/accounts", icon: Wallet },
    { name: "Profil", href: "/profile", icon: User },
  ];

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] bg-white dark:bg-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-blue-600 transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon
                className={`w-6 h-6 mb-1 ${
                  isActive ? "text-blue-600 dark:text-blue-500" : "text-slate-400 dark:text-slate-500"
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
