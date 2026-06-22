import { useState } from "react";
import { apiRequest } from "../api";
import { recommendationData } from "../data/demodata";
import { Bot, CheckCircle2, Lightbulb } from "lucide-react";

const cardCls = "rounded-xl border border-white/[0.07] bg-[#0f0f1c]/90 p-6";

function Recommendation() {
  const [result, setResult] = useState(recommendationData);
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    setLoading(true);
    const payload = {
      itemName: "MacBook Air",
      cost: 90000,
      currentSavings: 120000,
      goal: "Higher Studies Fund",
      goalDelayMonths: 18,
      riskLevel: "Medium",
      healthScore: 68,
    };
    try {
      const res = await apiRequest("/recommendation", "POST", payload);
      setResult(res.data);
    } catch {
      setResult(recommendationData);
    } finally {
      setLoading(false);
    }
  };

  const scenario = [
    ["Purchase",     "MacBook Air"],
    ["Cost",         "₹90,000"],
    ["Goal",         "Higher Studies Fund"],
    ["Health Score", "68 / 100"],
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">AI Advisor</h1>
        <p className="text-sm text-slate-500 mt-0.5">Personalized, actionable financial guidance.</p>
      </div>

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-[0.9fr_1.2fr_1fr]">

        {/* ── Scenario ── */}
        <div className={cardCls}>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">User Scenario</h2>

          <div className="divide-y divide-white/[0.06]">
            {scenario.map(([label, value]) => (
              <div key={label} className="flex justify-between py-3">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-semibold text-slate-200">{value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={getRecommendation}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Thinking…" : "Generate Advice"}
          </button>
        </div>

        {/* ── AI Decision ── */}
        <div className={`${cardCls} flex flex-col items-center text-center`}>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 mb-5">
            <Bot size={30} className="text-indigo-400" />
          </div>

          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">AI Decision</h2>

          <div className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] p-6 mb-5">
            <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-3" />
            <p className="text-2xl font-bold text-emerald-300">{result.decision}</p>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">{result.summary}</p>
        </div>

        {/* ── Smart Suggestions ── */}
        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb size={16} className="text-amber-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Smart Suggestions</h2>
          </div>

          <ul className="space-y-4">
            {result.recommendations.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mt-0.5">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                </div>
                <span className="text-sm text-slate-400 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Summary</p>
            <div className="space-y-2.5 text-sm">
              {[
                ["Risk level",   "Medium",     "text-amber-400"],
                ["Goal delay",   "+18 months", "text-rose-400" ],
                ["Health score", "68 / 100",   "text-slate-300"],
              ].map(([label, val, cls]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}</span>
                  <span className={`font-semibold ${cls}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Recommendation;