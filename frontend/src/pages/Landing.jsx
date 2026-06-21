import { Link } from "react-router-dom";
import { BarChart3, Wallet, Clock3, Bot, Target, Sparkles } from "lucide-react";

function Landing() {
  const stats = [
    [BarChart3, "Health Score", "68/100"],
    [Wallet, "Savings", "₹1,20,000"],
    [Clock3, "Goal Delay", "+18 Months"],
    [Bot, "AI Suggestion", "Wait 3 Months"],
  ];

  const features = [
    [Target, "Predict Goal Delays"],
    [Wallet, "Analyze Purchase Impact"],
    [Bot, "Get AI Financial Advice"],
  ];

  return (
    <main className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-6 py-10 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.25),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.15),transparent_40%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <section className="relative z-10 max-w-6xl">
        <p className="mb-4 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
          <Sparkles size={16} />
          AI-Powered Financial Intelligence
        </p>

        <h1 className="text-4xl font-black uppercase leading-[0.9] md:text-7xl">
          See The Future Impact
          <br />
          <span className="bg-gradient-to-r from-white via-purple-400 to-cyan-300 bg-clip-text">
            Of Every Purchase
          </span>
        </h1>

        <p className="mt-5 text-xl font-bold text-slate-300 md:text-2xl">
          Student Financial Decision Simulator
        </p>

        <p className="mt-4 text-2xl font-black text-purple-400 md:text-3xl">
          Simulate. <span className="text-white">Analyze.</span>{" "}
          <span className="text-cyan-300">Decide.</span>
        </p>

        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-300">
          Most students track spending after mistakes. <br />
          FinSight helps you evaluate decisions before making them.
        </p>

        <div className="mx-auto mt-6 grid max-w-4xl gap-4 rounded-3xl border border-cyan-400/25 bg-black/35 p-4 shadow-[0_0_35px_rgba(34,211,238,0.15)] backdrop-blur-xl md:grid-cols-4">
          {stats.map(([Icon, label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <Icon size={28} className="mx-auto text-cyan-300" />
              <p className="mt-2 text-sm text-slate-400">{label}</p>
              <h3 className="mt-1 text-lg font-black text-cyan-300">
                {value}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/simulator"
            className="rounded-full border border-purple-400/70 bg-white/5 px-8 py-4 font-black text-purple-300 transition hover:bg-purple-500/20"
          >
            Analyze Purchase
          </Link>

          <Link
            to="/dashboard"
            className="rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-8 py-4 font-black text-white shadow-[0_0_25px_rgba(34,211,238,0.35)] transition hover:scale-105"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {features.map(([Icon, text]) => (
            <div
              key={text}
              className="flex items-center justify-center gap-3 rounded-2xl border border-purple-400/25 bg-white/5 p-5 text-slate-200 backdrop-blur"
            >
              <Icon size={24} className="text-cyan-300" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Landing;