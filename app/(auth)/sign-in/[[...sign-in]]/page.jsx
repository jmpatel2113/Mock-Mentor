import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return(
    <section className="page-shell min-h-screen">
      <div className="page-content grid min-h-screen gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="surface-panel flex flex-col justify-between p-8 sm:p-10">
          <div>
            <div className="eyebrow">Sign in</div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Return to your interview workspace.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
              Practice rounds, saved feedback, and subscription progress all live behind your account.
            </p>
          </div>

          <div className="grid gap-4">
            {["Role-specific interview generation", "Voice-based answer capture", "Stored feedback and retakes"].map((item) => (
              <div key={item} className="rounded-[22px] bg-[#fffaf2] px-5 py-5 text-sm leading-7 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </aside>

        <main className="surface-panel flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]">Mock Mentor</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Sign in to continue</h2>
            </div>
            <SignIn />
          </div>
        </main>
      </div>
    </section>
  );
}
