"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import AuthGuard from "@/components/AuthGuard";

const redQuestions = [
  {
    name: "q_structural",
    label: "Is the house free from structural issues that could worsen with compaction or even cause it to collapse? (e.g. walls which appear unstable, or the foundation shifted after construction)",
  },
  {
    name: "q_walls",
    label: "Are the walls intact, without significant cracks which affect also bricks or wall breaking from outside to inside?",
  },
  {
    name: "q_rising_damp",
    label: "Ask a client and observe: is the house free from rising damp? (Seen by water rising up the walls or a wet ground)",
  },
];

const yellowQuestions = [
  {
    name: "q_mold",
    label: "Do you see moisture or mold on the floor or the interior walls, particularly at the base of the wall? Ask the customer if they see these issues in rainy season.",
    yellowOn: "Yes",
  },
  {
    name: "q_drainage",
    label: "Use a bubble level perpendicular to the wall and measure the slope over a 1-meter distance. Is there a drainage problem? (i.e. rainwater does not naturally drain away from the house in that area)",
    yellowOn: "Yes",
  },
  {
    name: "q_soil",
    label: "Is the surrounding soil loam soil? (igishonyi soil / silty loam soil)",
    yellowOn: "Yes",
  },
  {
    name: "q_floor_level",
    label: "Is the floor inside the house lower than the natural ground outside?",
    yellowOn: "Yes",
  },
];

function YesNoQuestion({ name, label, number }: { name: string; label: string; number: number }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-brand-black leading-relaxed">
        <span className="mr-2 font-bold">{number}.</span>
        {label}
      </p>
      <div className="flex gap-3">
        {["Yes", "No"].map((opt) => (
          <label
            key={opt}
            className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-brand-black/15 px-4 py-3 text-sm font-semibold text-brand-black transition-all hover:border-brand-orange hover:bg-brand-orange/5 has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/10 has-[:checked]:text-brand-orange"
          >
            <input type="radio" name={name} value={opt} required className="sr-only" />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function QuestionsPage() {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const isRed = redQuestions.some((q) => data.get(q.name) === "No");
    if (isRed) {
      router.push("/assessment/complete?result=red");
      return;
    }

    const isYellow = yellowQuestions.some((q) => data.get(q.name) === q.yellowOn);
    router.push(isYellow ? "/assessment/complete?result=yellow" : "/assessment/complete?result=green");
  }

  return (
    <AuthGuard>
    <div className="flex min-h-screen flex-col bg-brand-white">
      <main className="flex flex-1 flex-col items-center px-4 py-10">
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-brand-black">House Assessment</h1>
              <p className="text-sm text-brand-black/50">Fill in all fields accurately based on your site visit.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm font-medium text-brand-black">
                <span className="mr-2 font-bold">1.</span>Your full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                required
                className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="district" className="text-sm font-medium text-brand-black">
                <span className="mr-2 font-bold">2.</span>District
              </label>
              <input
                id="district"
                name="district"
                type="text"
                placeholder="e.g. Gasabo, Kicukiro"
                required
                className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
              />
            </div>

            <div className="h-px bg-brand-black/10" />

            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Structural Assessment</p>

            <div className="flex flex-col gap-6">
              {redQuestions.map((q, i) => (
                <YesNoQuestion key={q.name} name={q.name} label={q.label} number={i + 3} />
              ))}
            </div>

            <div className="h-px bg-brand-black/10" />

            <p className="text-xs font-semibold uppercase tracking-widest text-yellow-600">Moisture Assessment</p>

            <div className="flex flex-col gap-6">
              {yellowQuestions.map((q, i) => (
                <YesNoQuestion key={q.name} name={q.name} label={q.label} number={i + 6} />
              ))}
            </div>

            <div className="h-px bg-brand-black/10" />

            <div className="flex flex-col gap-2">
              <label htmlFor="observations" className="text-sm font-medium text-brand-black">
                <span className="mr-2 font-bold">10.</span>
                Any other observations?{" "}
                <span className="text-brand-black/40 font-normal">(Optional)</span>
              </label>
              <textarea
                id="observations"
                name="observations"
                placeholder="Write any additional observations here..."
                rows={4}
                className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-orange py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-orange-dark active:scale-95"
            >
              Submit Assessment
            </button>
          </form>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
