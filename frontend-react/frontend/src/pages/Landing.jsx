import { Link } from "react-router-dom";
import {
  BarChart2, Target, Wallet, Bot,
  ArrowRight, TrendingUp, Shield,
  TrendingDown,
} from "lucide-react";

const stats = [
  { label: "Health Score",  value: "68 / 100",    delta: "−14 this month",    bad: true  },
  { label: "Total Savings", value: "₹1,20,000",   delta: "+₹25k this month",  bad: false },
  { label: "Goal Delay",    value: "+18 months",  delta: "After simulation",   bad: true  },
  { label: "AI Suggestion", value: "Wait 3 Mo.",  delta: "Based on your data", bad: false },
];

const features = [
  {
    icon: Target,
    title: "Predict Goal Delays",
    desc: "See exactly how a purchase shifts your savings goals in time.",
    to: "/goals",
    accent: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Wallet,
    title: "Analyze Purchase Impact",
    desc: "Run a simulation before you spend to see the real financial cost.",
    to: "/simulator",
    accent: "text-sky-400",
    iconBg: "bg-sky-500/10 border-sky-500/20",
  },
  {
    icon: Bot,
    title: "Get AI Financial Advice",
    desc: "Receive personalized guidance based on your current financial picture.",
    to: "/recommendation",
    accent: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

function Landing() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-7">
          <Shield size={11} />
          AI-Powered Financial Intelligence
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          See the impact of every purchase
          <br />
          <span className="text-indigo-400">before you make it.</span>
        </h1>

        <p className="mt-6 mx-auto max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
          FinSight helps students simulate financial decisions and understand their
          long-term consequences — before committing to a purchase.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/simulator"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            <TrendingUp size={15} />
            Analyze Purchase
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.09] transition-colors"
          >
            <BarChart2 size={15} />
            View Dashboard
          </Link>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-white/[0.07] bg-[#0c0c18]/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.07]">
            {stats.map(({ label, value, delta, bad }) => (
              <div key={label} className="px-6 py-6">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="mt-1.5 text-2xl font-bold text-white">{value}</p>
                <p className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${bad ? "text-rose-400" : "text-emerald-400"}`}>
                  {bad ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                  {delta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-xl font-bold text-white">What you can do with FinSight</h2>
          <p className="mt-2 text-sm text-slate-500">Three core tools built for student financial clarity.</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, to, accent, iconBg }) => (
            <Link
              key={title}
              to={to}
              className="group flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-[#0f0f1c]/80 p-6 hover:border-white/[0.15] hover:bg-[#111120] transition-all"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${iconBg}`}>
                <Icon size={19} className={accent} />
              </div>
              <div>
                <h3 className={`font-semibold text-white group-hover:${accent} transition-colors`}>
                  {title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${accent}`}>
                Get started <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Landing;