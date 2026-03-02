import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ result?: string }>;
}

export default async function CompletePage({ searchParams }: PageProps) {
  const { result } = await searchParams;

  if (result === "red") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-white px-4">
        <div className="w-full max-w-lg flex flex-col items-center gap-8 text-center animate-fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-red-500">Red</h1>
            <p className="text-brand-black/60 text-base leading-relaxed max-w-sm">
              This house has significant structural issues. It is not suitable for flooring installation and cannot proceed to registration.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center rounded-xl border border-brand-black/20 py-3 text-sm font-semibold text-brand-black transition-all hover:border-brand-black/40 active:scale-95"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  if (result === "yellow") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-white px-4">
        <div className="w-full max-w-lg flex flex-col items-center gap-8 text-center animate-fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-yellow-600">Yellow</h1>
            <p className="text-brand-black/60 text-base leading-relaxed max-w-sm">
              Moisture intervention is required before installation.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <button className="w-full rounded-xl bg-yellow-500 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-yellow-600 active:scale-95">
              Register an Opportunity
            </button>
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center rounded-xl border border-brand-black/20 py-3 text-sm font-semibold text-brand-black transition-all hover:border-brand-black/40 active:scale-95"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-white px-4">
      <div className="w-full max-w-lg flex flex-col items-center gap-8 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-green-600">Green</h1>
          <p className="text-brand-black/60 text-base leading-relaxed max-w-sm">
            This house passes all checks. You can proceed to register an opportunity for this client.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <button className="w-full rounded-xl bg-green-600 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-green-700 active:scale-95">
            Register an Opportunity
          </button>
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center rounded-xl border border-brand-black/20 py-3 text-sm font-semibold text-brand-black transition-all hover:border-brand-black/40 active:scale-95"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
