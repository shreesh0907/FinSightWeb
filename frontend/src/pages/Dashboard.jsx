import {
  BarChart3,
  Wallet,
  Target,
  ShieldAlert,
  Bot,
  Laptop,
} from "lucide-react";
import { dashboardData } from "../data/demodata";

function Dashboard() {
  const stats = [
    [BarChart3, "Health Score", `${dashboardData.healthScore}/100`, "Good"],
    [
      Wallet,
      "Current Savings",
      `₹${dashboardData.currentSavings.toLocaleString("en-IN")}`,
      "Available",
    ],
    [Target, "Active Goals", dashboardData.activeGoals, "In Progress"],
    [ShieldAlert, "Risk Level", dashboardData.riskLevel, "Current"],
  ];

  return (
    <main className="px-6 pt-20 pb-12 md:px-16">
      <div className="mb-10 text-center">
        <p className="text-xl text-slate-300">
          Your financial snapshot before making decisions.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-4">
        {stats.map(([Icon, title, value, subtitle]) => (
          <div
            key={title}
            className="rounded-3xl border border-cyan-400/25 bg-[#080819]/80 p-7 shadow-[0_0_25px_rgba(34,211,238,0.12)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-slate-300">{title}</p>
              <Icon size={24} className="text-cyan-300" />
            </div>

            <h2 className="mt-5 text-4xl font-black">{value}</h2>
            <p className="mt-3 font-bold text-slate-300">{subtitle}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="rounded-3xl border border-cyan-400/25 bg-[#080819]/80 p-7 shadow-[0_0_25px_rgba(34,211,238,0.12)]">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-black">
            <Target className="text-cyan-300" />
            Active Goals
          </h2>

          {[
            ["Higher Studies Fund", "₹80,000 / ₹1,50,000", "53%"],
            ["Emergency Fund", "₹60,000 / ₹1,00,000", "60%"],
            ["Certification Budget", "₹12,000 / ₹30,000", "40%"],
          ].map(([title, amount, progress]) => (
            <div key={title} className="mb-6">
              <div className="flex justify-between gap-4 text-sm text-slate-300">
                <span>{title}</span>
                <span>{amount}</span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  style={{ width: progress }}
                />
              </div>

              <p className="mt-2 text-sm text-slate-400">
                {progress} completed
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-purple-400/25 bg-[#080819]/80 p-7 shadow-[0_0_25px_rgba(168,85,247,0.12)]">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-black">
            <Laptop className="text-purple-300" />
            Recent Simulation
          </h2>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-slate-400">Purchase</p>
              <h3 className="text-2xl font-black">MacBook Air</h3>
            </div>

            <div>
              <p className="text-sm text-slate-400">Cost</p>
              <h3 className="text-2xl font-black">₹90,000</h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Health Score</p>
              <h3 className="mt-1 text-xl font-black text-cyan-300">
                82 → 68
              </h3>
            </div>

            <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/5 p-4">
              <p className="text-sm text-slate-400">Risk</p>
              <h3 className="mt-1 text-xl font-black text-yellow-300">
                Medium
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-400/25 bg-[#080819]/80 p-7 shadow-[0_0_25px_rgba(34,211,238,0.12)]">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-black">
            <Bot className="text-cyan-300" />
            AI Advice
          </h2>

          <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-5">
            <p className="text-sm font-bold text-cyan-300">Recommendation</p>
            <h3 className="mt-3 text-3xl font-black">Wait 3 Months</h3>
            <p className="mt-4 leading-relaxed text-slate-300">
              Saving ₹15,000 more before purchasing can reduce your goal delay
              and protect your emergency fund.
            </p>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">
            <p>✓ Avoids reducing savings too sharply.</p>
            <p>✓ Keeps emergency fund above safer levels.</p>
            <p>✓ Improves long-term goal stability.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;