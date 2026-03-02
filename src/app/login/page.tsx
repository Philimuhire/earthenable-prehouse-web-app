"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { login, loginWithGoogle } from "@/lib/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && googleBtnRef.current) {
        clearInterval(interval);
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  async function handleGoogleCallback(response: { credential: string }) {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle(response.credential);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-white px-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-16 w-28">
            <Image
              src="/images/EE.png"
              alt="EarthEnable Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl font-bold text-brand-black">Welcome back</h1>
            <p className="text-sm text-brand-black/50">Sign in to your account</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-medium text-brand-black">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="eerwcso@earthenable.org"
              required
              className="rounded-xl border border-brand-black/20 px-4 py-3 text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-brand-black">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-brand-orange hover:underline underline-offset-4 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="rounded-xl border border-brand-black/20 px-4 py-3 text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl bg-brand-orange py-3 text-base font-semibold text-white transition-all hover:bg-brand-orange-dark active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-brand-black/10" />
          <span className="text-xs text-brand-black/40 font-medium">or continue with</span>
          <div className="h-px flex-1 bg-brand-black/10" />
        </div>

        <div ref={googleBtnRef} className="flex justify-center" />
      </div>
    </div>
  );
}
