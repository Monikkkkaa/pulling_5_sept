"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("pp_token");
    if (!storedToken) {
      router.replace("/login");
      return;
    }
    setMounted(true);
    fetchProfile(storedToken);
  }, [router]);

  const fetchProfile = async (authToken) => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 animate-pulse-glow"></div>
      <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      
      <Navbar />
      <section className={`relative mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="space-y-6">
          <div className="text-center space-y-2 animate-slide-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              👤 My Profile
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Manage your account information
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md dark:bg-slate-800/90 transition-all duration-500 hover:shadow-purple-500/25 animate-slide-in" style={{animationDelay: '0.2s'}}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                <span className="text-3xl">👨💼</span>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-slate-600 dark:text-slate-300">Loading profile...</span>
                </div>
              ) : error ? (
                <div className="p-4 text-red-600 bg-red-50/80 dark:bg-red-900/30 dark:text-red-300 rounded-xl border-l-4 border-red-500 backdrop-blur-sm">
                  ⚠️ {error}
                </div>
              ) : profile ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        🆔 User ID
                      </label>
                      <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border">
                        <span className="text-slate-600 dark:text-slate-300 font-mono text-sm">{profile.id}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        👤 Full Name
                      </label>
                      <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border">
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{profile.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      📧 Email Address
                    </label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border">
                      <span className="text-slate-800 dark:text-slate-200">{profile.email}</span>
                    </div>
                  </div>
                </div>
              ) : null}
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  🏠 Back to Dashboard
                </Button>
                <Button 
                  onClick={() => fetchProfile(localStorage.getItem("pp_token"))}
                  variant="outline"
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-xl"
                >
                  🔄 Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}