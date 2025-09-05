"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { logout, setAuth } from '@/lib/store';
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("pp_user");
      const storedToken = localStorage.getItem("pp_token");
      if (storedUser && storedToken) {
        dispatch(setAuth({ 
          user: JSON.parse(storedUser), 
          token: storedToken 
        }));
      }
    } catch (e) {}
  }, [pathname, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("pp_token");
    localStorage.removeItem("pp_user");
    router.push("/login");
  };

  return (
    <header className="w-full border-b border-white/20 bg-white/80 backdrop-blur-md dark:bg-slate-800/80 shadow-lg">
      <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
        <Link
          href={user ? "/dashboard" : "/login"}
          className="font-bold text-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 flex items-center gap-2"
        >
          🗳️ Polling Platform
        </Link>
        <nav className="flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-all duration-200"
                >
                  🚀 Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200 hover:scale-105"
                >
                  ✨ Sign up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-all duration-200"
                >
                  🏠 Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-all duration-200"
                >
                  👤 Profile
                </Button>
              </Link>
              <Button 
                size="sm" 
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all duration-200 hover:scale-105"
              >
                🚪 Logout
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
