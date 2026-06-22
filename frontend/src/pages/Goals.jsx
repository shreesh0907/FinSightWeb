import { useState } from "react";
import { apiRequest } from "../api";
import { goalDelayData } from "../data/demodata";
import { Target, Clock, AlertTriangle } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition";
const labelCls = "mb-1.5 mt-4 block text-xs font-medium text-slate-400 uppercase tracking-wide";
const cardCls  = "rounded-xl border border-white/[0.07] bg-[#0f0f1c]/90 p-6";

function Goals() {
  const [formData, setFormData] = useState({
    goalAmount: 150000,
    currentSavings: 80000,
    monthlySavings: 5000,
    purchaseCost: 90000,
  });

  const [result, setResult] = useState(goalDelayData);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: Number(e.target.value) }));

  const calculateDelay = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest("/goals/delay", "POST", formData);
      setResult(res.data);
    } catch {
      setResult(goalDelayData);
    }
  };

  const gap = formData.goalAmount - formData.currentSavings;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Goal Planner</h1>
        <p className="text-sm text-slate-500 mt-0.5">See how today's purchase affects tomorrow's goals.</p>
      </div>

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-[0.9fr_1.5fr]">

        {/* ── Form ── */}
        <form onSubmit={calculateDelay} className={cardCls}>
          <div className="flex items-center gap-2 mb-6">
            <Target size={16} className="text-indigo-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Goal Details</h2>
          </div>

          {[
            ["Goal Amount (₹)",    "goalAmount"],
            ["Current Savings (₹)","currentSavings"],
            ["Monthly Savings (₹)","monthlySavings"],
            ["Purchase Cost (₹)",  "purchaseCost"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className={labelCls}>{label}</label>
              <input className={inputCls} type="number" name={name}
                     value={formData[name]} onChange={handleChange} />
            </div>
          ))}

          <button type="submit"
                  className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            Analyze Goal Impact
          </button>
        </form>

        {/* ── Results ── */}
        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-6">
            <Clock size={16} className="text-indigo-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Timeline Comparison</h2>
          </div>

          {/* Without purchase */}
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-4 mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Without Purchase</span>
              <span className="font-semibold text-emerald-400">{result.withoutPurchaseMonths} months</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div className="h-full w-[45%] rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* After purchase */}
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-4 mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">After Purchase</span>
              <span className="font-semibold text-rose-400">{result.afterPurchaseMonths} months</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div className="h-full w-[90%] rounded-full bg-rose-500" />
            </div>
          </div>

          {/* Delay callout */}
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.07] p-5 flex items-center gap-4 mb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10">
              <AlertTriangle size={19} className="text-rose-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-400 mb-0.5">Goal Delay</p>
              <p className="text-2xl font-bold text-rose-300">+{result.delayMonths} months</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Your goal gets pushed back if you make this purchase today.
              </p>
            </div>
          </div>

          {/* Mini stat cards */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            {[
              { label: "Current Gap",    val: `₹${gap.toLocaleString("en-IN")}`,                         cls: "text-indigo-300"  },
              { label: "Purchase Impact",val: `₹${formData.purchaseCost.toLocaleString("en-IN")}`,        cls: "text-amber-300"   },
              { label: "Monthly Saving", val: `₹${formData.monthlySavings.toLocaleString("en-IN")}`,      cls: "text-emerald-300" },
            ].map(({ label, val, cls }) => (
              <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                <p className="text-xs text-slate-600 mb-1">{label}</p>
                <p className={`text-base font-bold ${cls}`}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Goals;