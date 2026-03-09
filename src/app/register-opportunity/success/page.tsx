import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-white px-4">
      <div className="w-full max-w-lg flex flex-col items-center gap-8 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-green-600">Opportunity Registered</h1>
          <p className="text-brand-black/60 text-base leading-relaxed max-w-sm">
            The opportunity has been successfully created in Salesforce. You can now start a new
            assessment.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex w-full items-center justify-center rounded-xl bg-brand-orange py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-orange-dark active:scale-95"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
