import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { simulationResult } from "../data/demodata";
import { apiRequest } from "../api";
import { ShoppingCart, BarChart2, ShieldAlert } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition";
const labelCls = "mb-1.5 mt-4 block text-xs font-medium text-slate-400 uppercase tracking-wide";
const cardCls  = "rounded-xl border border-white/[0.07] bg-[#0f0f1c]/90 p-6";

function Simulator() {
  const [formData, setFormData] = useState({
    itemName: "MacBook Air",
    cost: 90000,
    category: "Gadget",
    goalId: "higher-studies",
    currentSavings: 120000,
    monthlyAllowance: 15000,
  });

  const [result, setResult] = useState(simulationResult);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest("/simulate", "POST", {
        ...formData,
        cost: Number(formData.cost),
        currentSavings: Number(formData.currentSavings),
        monthlyAllowance: Number(formData.monthlyAllowance),
      });
      setResult(res.data);
    } catch {
      setResult(simulationResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Purchase Simulator</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Understand the financial consequences before you buy.
        </p>
      </div>

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1fr_1.6fr_0.95fr]">

        {/* ── Form ── */}
        <form onSubmit={handleSimulate} className={cardCls}>
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart size={16} className="text-indigo-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Your Purchase</h2>
          </div>

          {[
            ["Item Name",             "itemName",        "text"],
            ["Cost (₹)",              "cost",            "number"],
            ["Current Savings (₹)",   "currentSavings",  "number"],
            ["Monthly Allowance (₹)", "monthlyAllowance","number"],
          ].map(([label, name, type]) => (
            <div key={name}>
              <label className={labelCls}>{label}</label>
              <input className={inputCls} name={name} type={type}
                     value={formData[name]} onChange={handleChange} />
            </div>
          ))}

          <label className={labelCls}>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}
                  className={inputCls + " bg-[#0f0f1c]"}>
            <option>Gadget</option>
            <option>Course</option>
            <option>Subscription</option>
            <option>Lifestyle</option>
          </select>

          <button type="submit" disabled={loading}
                  className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors">
            {loading ? "Analyzing…" : "Analyze Financial Impact"}
          </button>
        </form>

        {/* ── Impact Analysis ── */}
        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={16} className="text-indigo-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Impact Analysis</h2>
          </div>

          {/* Health bar */}
          <div className="mb-5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Financial Health</span>
              <span className="font-semibold text-slate-300">
                {result.healthScoreBefore} → {result.healthScoreAfter}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                   style={{ width: `${result.healthScoreAfter}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-600">Health score drops after this purchase.</p>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <ResultCard title="Savings"
              value={`₹${result.beforeSavings.toLocaleString("en-IN")} → ₹${result.afterSavings.toLocaleString("en-IN")}`}
              change={`${result.savingsReductionPercent}% reduction`} type="danger" />
            <ResultCard title="Emergency Fund"
              value={`${result.emergencyFundBefore} → ${result.emergencyFundAfter} months`}
              change="Safety net reduced" type="warning" />
            <ResultCard title="Health Score"
              value={`${result.healthScoreBefore} → ${result.healthScoreAfter}`}
              change="Score decreased" type="neutral" />
            <ResultCard title="Goal Delay"
              value={`+${result.goalDelayMonths} Months`}
              change="Goal pushed back" type="danger" />
          </div>
        </div>

        {/* ── AI Recommendation ── */}
        <div className={`${cardCls} flex flex-col`}>
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert size={16} className="text-amber-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AI Recommendation</h2>
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.07] p-4 text-center mb-5">
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-1">Risk Level</p>
            <p className="text-3xl font-bold text-amber-300">{result.riskLevel}</p>
          </div>

          <ul className="space-y-3 text-sm text-slate-400 mb-5">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 shrink-0">•</span>
              Delays goal by {result.goalDelayMonths} months.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 shrink-0">•</span>
              Emergency fund drops from {result.emergencyFundBefore} to {result.emergencyFundAfter} months.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-600 shrink-0">•</span>
              Health score falls by {result.healthScoreBefore - result.healthScoreAfter} points.
            </li>
          </ul>

          <div className="mt-auto rounded-lg border border-indigo-500/20 bg-indigo-500/[0.07] p-4">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Advice</p>
            <p className="text-sm text-slate-400">
              Wait 3 months and save ₹15,000 more before making this purchase.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Simulator;