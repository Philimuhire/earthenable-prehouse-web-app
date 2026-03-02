"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashPage() {
  const router = useRouter();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const navTimer = setTimeout(() => router.push("/assessment"), 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-brand-white">
      <div
        className={`flex flex-col items-center gap-6 transition-opacity duration-500 ${
          fading ? "opacity-0" : "opacity-0 animate-fade-in"
        }`}
      >
        <div className="relative h-32 w-48 sm:h-40 sm:w-64">
          <Image
            src="/images/EE.png"
            alt="EarthEnable Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-sm tracking-widest text-brand-black/50 uppercase">
          Pre-House Assessment
        </p>
      </div>
    </main>
  );
}
