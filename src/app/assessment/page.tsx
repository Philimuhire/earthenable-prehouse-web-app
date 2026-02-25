"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "ENG" | "KINY";

const languages: { value: Language; label: string; flag: string }[] = [
  { value: "ENG", label: "ENG", flag: "🇬🇧" },
  { value: "KINY", label: "KINY", flag: "🇷🇼" },
];

export default function AssessmentWelcomePage() {
  const [lang, setLang] = useState<Language>("ENG");

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex justify-end">
        <div className="flex rounded-xl border border-brand-black/15 overflow-hidden shadow-sm">
          {languages.map((l) => (
            <button
              key={l.value}
              onClick={() => setLang(l.value)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                lang === l.value
                  ? "bg-brand-orange text-white"
                  : "bg-white text-brand-black/60 hover:bg-brand-orange/5 hover:text-brand-black"
              }`}
            >
              <span className="text-base leading-none">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-brand-black leading-snug">
          Welcome to the House Pre-Approval Assessment Form.
        </h1>
        <p className="text-brand-black/65 text-base leading-relaxed">
          This form is designed to assist Customer Sales Officers (CSOs) in
          assessing whether a house meets the preliminary requirements before
          submitting it to the Construction Department. The objective is to
          determine if the property falls into the{" "}
          <span className="font-semibold text-red-500">Red</span>,{" "}
          <span className="font-semibold text-yellow-500">Yellow</span>, or{" "}
          <span className="font-semibold text-green-600">Green</span> category,
          and to minimize customer refunds by identifying &ldquo;Red
          category&rdquo; houses early.
        </p>
      </div>

      <Link
        href="/login"
        className="text-center text-base font-semibold text-brand-orange underline-offset-4 hover:underline hover:text-brand-orange-dark transition-colors"
      >
        Click here to login →
      </Link>
    </div>
  );
}
