"use client";

import Navbar from "@/components/navbar";
import AuthForm from "@/components/auth-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("pp_token");
    if (token) router.replace("/dashboard");
  }, [router]);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 animate-pulse-glow"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full opacity-15 animate-float" style={{animationDelay: '4s'}}></div>
      <Navbar />
      <section className="relative flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl animate-slide-in">
          <AuthForm mode="login" />
        </div>
      </section>
    </main>
  );
}
