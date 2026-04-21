import Link from "next/link";
import SiteHeader from "../components/site-header";

const highlights = [
  "AI-built technical interview sets tailored to the role you want.",
  "Spoken answers, instant scoring, and specific feedback after each session.",
  "A clean review loop for practicing repeatedly instead of guessing what to improve.",
];

const stats = [
  { value: "5", label: "questions per interview" },
  { value: "2", label: "free practice sessions today" },
  { value: "10", label: "point rating scale for each answer" },
];

export default function Home() {
  return (
    <main className="page-shell min-h-screen">
      <SiteHeader />

      <div className="page-content space-y-8 pt-10">
        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="surface-panel relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
            <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top,rgba(20,99,110,0.18),transparent_58%)] lg:block" />
            <span className="eyebrow">AI Interview Practice Studio</span>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Build interview confidence with a sharper, more usable practice loop.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Mock Mentor turns a role description into a guided mock interview, captures your spoken answers, and returns structured feedback so you can improve with each round.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Start Practicing
              </Link>
              <Link
                href="/howItWorks"
                className="rounded-full border border-[#cfbea7] bg-[#fff7ea] px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#f7eddc]"
              >
                See the Workflow
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[22px] border border-[#d9cfbf] bg-[#fffaf2] p-5">
                  <div className="text-3xl font-semibold text-slate-900">{stat.value}</div>
                  <div className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="soft-panel p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]">
                What improves
              </div>
              <ul className="mt-4 space-y-4">
                {highlights.map((item) => (
                  <li key={item} className="rounded-[20px] bg-white px-4 py-4 text-sm leading-7 text-slate-600 shadow-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-panel bg-slate-900 px-6 py-6 text-white">
              <div className="text-sm uppercase tracking-[0.16em] text-[#d8e8e2]">Practice promise</div>
              <p className="mt-4 text-2xl font-semibold leading-tight">
                No more vague preparation. Every session should leave you with a clearer next move.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                The current product focuses on technical mock interviews, feedback review, and repeat practice from the dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Generate",
              copy: "Enter the role, stack, and experience level. Mock Mentor builds a focused question set from that context.",
            },
            {
              title: "Respond",
              copy: "Answer aloud with your microphone. The interview screen is designed to keep the current question and answer controls clear.",
            },
            {
              title: "Review",
              copy: "Compare your answer to the ideal response, inspect the score, and identify the patterns you need to improve.",
            },
          ].map((item, index) => (
            <div key={item.title} className="surface-panel p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1f5d55]">
                0{index + 1}
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
