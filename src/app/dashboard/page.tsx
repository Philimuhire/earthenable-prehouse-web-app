import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
    <div className="flex min-h-screen flex-col bg-brand-white">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg flex flex-col gap-8 animate-fade-in">
          <div className="flex flex-col gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-brand-orange"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-brand-black leading-snug">
                House Pre-Approval Assessment
              </h1>
              <p className="text-brand-black/60 text-base leading-relaxed">
                Welcome! Use this app to assess whether a house meets the
                preliminary requirements before submitting it to the Construction
                Department.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm flex flex-col gap-4">
            <p className="text-sm font-semibold text-brand-black">Before you begin</p>
            <ul className="flex flex-col gap-3 text-sm text-brand-black/60">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-orange font-bold">•</span>
                Ensure you are at the client&apos;s house during the assessment.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-orange font-bold">•</span>
                Answer all questions honestly based on what you observe on site.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-orange font-bold">•</span>
                The result will categorize the house as{" "}
                <span className="font-semibold text-red-500">Red</span>,{" "}
                <span className="font-semibold text-yellow-500">Yellow</span>, or{" "}
                <span className="font-semibold text-green-600">Green</span>.
              </li>
            </ul>
          </div>

          <Link
            href="/assessment/questions"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-orange-dark active:scale-95"
          >
            Start Assessment →
          </Link>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
