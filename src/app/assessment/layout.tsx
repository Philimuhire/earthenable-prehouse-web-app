export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-white">
      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}
