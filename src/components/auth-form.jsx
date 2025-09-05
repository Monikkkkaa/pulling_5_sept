"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setAuth, setError } from "@/lib/store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthForm({ mode = "login" }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const isLogin = mode === "login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [focusedField, setFocusedField] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(setError(null));
  }, [dispatch]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      const res = await fetch(
        isLogin ? "/api/auth/login" : "/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      console.log(data, "<=======");

      if (!res.ok) throw new Error(data?.message || "Request failed");

      // Store in Redux and localStorage
      dispatch(setAuth({ user: data.user, token: data.token }));
      localStorage.setItem("pp_token", data.token);
      localStorage.setItem("pp_user", JSON.stringify(data.user));

      router.replace("/dashboard");
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Card
      className={`w-full shadow-2xl border-0 bg-white/90 backdrop-blur-md dark:bg-slate-800/90 transition-all duration-700 hover:shadow-purple-500/25 hover:scale-[1.02] ${
        mounted ? "animate-slide-in" : "opacity-0"
      }`}
    >
      <CardHeader className="space-y-3 pb-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
          <span className="text-2xl">🗳️</span>
        </div>
        <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-fade-in">
          {isLogin ? "Welcome Back" : "Join Us Today"}
        </CardTitle>
        <p
          className="text-base text-slate-600 dark:text-slate-300 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {isLogin
            ? "Sign in to continue your polling journey"
            : "Create your account and start polling"}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-6 sm:px-8">
        <form onSubmit={onSubmit} className="space-y-5">
          {!isLogin && (
            <div
              className="space-y-2 animate-slide-in"
              style={{ animationDelay: "0.1s" }}
            >
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"
              >
                👤 Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  className={`h-12 border-2 transition-all duration-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl ${
                    focusedField === "name"
                      ? "border-purple-500 shadow-lg shadow-purple-500/25 scale-[1.02]"
                      : "border-slate-300 dark:border-slate-600 hover:border-purple-300"
                  }`}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}
          <div
            className="space-y-2 animate-slide-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"
            >
              📧 Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                className={`h-12 border-2 transition-all duration-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl ${
                  focusedField === "email"
                    ? "border-purple-500 shadow-lg shadow-purple-500/25 scale-[1.02]"
                    : "border-slate-300 dark:border-slate-600 hover:border-purple-300"
                }`}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div
            className="space-y-2 animate-slide-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"
            >
              🔒 Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className={`h-12 border-2 transition-all duration-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl ${
                  focusedField === "password"
                    ? "border-purple-500 shadow-lg shadow-purple-500/25 scale-[1.02]"
                    : "border-slate-300 dark:border-slate-600 hover:border-purple-300"
                }`}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50/80 dark:bg-red-900/30 dark:text-red-300 rounded-xl border-l-4 border-red-500 backdrop-blur-sm animate-slide-in">
              ⚠️ {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in"
            style={{ animationDelay: "0.4s" }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              <span className="flex items-center gap-2">
                {isLogin ? "🚀 Sign In" : "✨ Create Account"}
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-6 pb-8">
        <p
          className="text-sm text-center text-slate-600 dark:text-slate-300 w-full animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          {isLogin ? (
            <>
              New here?{" "}
              <a
                href="/signup"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Create an account
              </a>
            </>
          ) : (
            <>
              Already a member?{" "}
              <a
                href="/login"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign in here
              </a>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
