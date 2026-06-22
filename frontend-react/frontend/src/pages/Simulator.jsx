import { useEffect, useState } from "react";
import ResultCard from "../components/ResultCard";
import { simulationResult } from "../data/demodata";
import { apiRequest } from "../api";
import { ShoppingCart, BarChart2, ShieldAlert } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition";
const labelCls =
  "mb-1.5 mt-4 block text-xs font-medium text-slate-400 uppercase tracking-wide";
const cardCls = "rounded-xl border border-white/[0.07] bg-[#0f0f1c]/90 p-6";

const defaultForm = {
  itemName: "",
  cost: "",
  category: "Gadget",
  goalId: "higher-studies",
  currentSavings: "",
  monthlyAllowance: "",
};

const getSavedForm = () => {
  try {
    const saved = localStorage.getItem("lastSimulationForm");
    return saved ? JSON.parse(saved) : defaultForm;
  } catch {
    return defaultForm;
  }
};

const getSavedResult = () => {
  try {
    const saved = localStorage.getItem("lastSimulationResult");
    return saved ? JSON.parse(saved) : simulationResult;
  } catch {
    return simulationResult;
  }
};

function Simulator() {
  const [formData, setFormData] = useState(getSavedForm);
  const [result, setResult] = useState(getSavedResult);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("lastSimulationForm", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      itemName: formData.itemName.trim(),
      cost: Number(formData.cost),
      currentSavings: Number(formData.currentSavings),
      monthlyAllowance: Number(formData.monthlyAllowance),
    };

    try {
      const res = await apiRequest("/simulate", "POST", payload);

      const finalResult = {
        ...res.data,
        itemName: res.data.itemName || payload.itemName,
        category: res.data.category || payload.category,
      };

      setResult(finalResult);
      localStorage.setItem("lastSimulationResult", JSON.stringify(finalResult));
    } catch (err) {
      console.error("Simulation API error:", err.message);
      alert(err.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setFormData(defaultForm);
    setResult(simulationResult);
    localStorage.removeItem("lastSimulationForm");
    localStorage.removeItem("lastSimulationResult");
  };

  const itemName = result.itemName || formData.itemName || "this purchase";
  const extraSaving = Math.max(
    0,
    Math.round((Number(formData.cost || 0) * 0.15) / 1000) * 1000
  );

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Purchase Simulator</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Understand the financial consequences before you buy.
        </p>
      </div>

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1fr_1.6fr_0.95fr]">
        <form onSubmit={handleSimulate} className={cardCls}>
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart size={16} className="text-indigo-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Your Purchase
            </h2>
          </div>

          {[
            ["Item Name", "itemName", "text", "iPhone 15"],
            ["Cost (₹)", "cost", "number", "75000"],
            ["Current Savings (₹)", "currentSavings", "number", "120000"],
            ["Monthly Allowance (₹)", "monthlyAllowance", "number", "15000"],
          ].map(([label, name, type, placeholder]) => (
            <div key={name}>
              <label className={labelCls}>{label}</label>
              <input
                className={inputCls}
                name={name}
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <label className={labelCls}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputCls + " bg-[#0f0f1c]"}
          >
            <option>Gadget</option>
            <option>Course</option>
            <option>Subscription</option>
            <option>Lifestyle</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Analyzing…" : "Analyze Financial Impact"}
          </button>

          <button
            type="button"
            onClick={resetSimulation}
            className="mt-3 w-full rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] transition-colors"
          >
            Reset Simulation
          </button>
        </form>

        <div className={cardCls}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={16} className="text-indigo-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Impact Analysis
            </h2>
          </div>

          <div className="mb-5 rounded-lg border border-white/[0.07] bg-white/[0.03] p-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">Financial Health after {itemName}</span>
              <span className="font-semibold text-slate-300">
                {result.healthScoreBefore} → {result.healthScoreAfter}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                style={{ width: `${Math.max(0, Math.min(100, result.healthScoreAfter || 0))}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Health score updates after analyzing {itemName}.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <ResultCard
              title="Savings"
              value={`₹${Number(result.beforeSavings || 0).toLocaleString("en-IN")} → ₹${Number(
                result.afterSavings || 0
              ).toLocaleString("en-IN")}`}
              change={`${result.savingsReductionPercent || 0}% reduction`}
              type="danger"
            />
            <ResultCard
              title="Emergency Fund"
              value={`${result.emergencyFundBefore || 0} → ${result.emergencyFundAfter || 0} months`}
              change="Safety net reduced"
              type="warning"
            />
            <ResultCard
              title="Health Score"
              value={`${result.healthScoreBefore || 0} → ${result.healthScoreAfter || 0}`}
              change="Score updated"
              type="neutral"
            />
            <ResultCard
              title="Goal Delay"
              value={`+${result.goalDelayMonths || 0} Months`}
              change={`${itemName} affects your goal timeline`}
              type="danger"
            />
          </div>
        </div>

        <div className={`${cardCls} flex flex-col`}>
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert size={16} className="text-amber-400" />
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              AI Recommendation
            </h2>
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.07] p-4 text-center mb-5">
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-1">
              Risk Level for {itemName}
            </p>
            <p className="text-3xl font-bold text-amber-300">{result.riskLevel}</p>
          </div>

          <ul className="space-y-3 text-sm text-slate-400 mb-5">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 shrink-0">•</span>
              Buying {itemName} delays your goal by {result.goalDelayMonths || 0} months.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 shrink-0">•</span>
              Emergency fund drops from {result.emergencyFundBefore || 0} to{" "}
              {result.emergencyFundAfter || 0} months.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-600 shrink-0">•</span>
              Health score changes by{" "}
              {Math.abs((result.healthScoreBefore || 0) - (result.healthScoreAfter || 0))} points.
            </li>
          </ul>

          <div className="mt-auto rounded-lg border border-indigo-500/20 bg-indigo-500/[0.07] p-4">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">
              Advice
            </p>
            <p className="text-sm text-slate-400">
              {result.riskLevel === "High"
                ? `Avoid buying ${itemName} right now. Build more savings first.`
                : result.riskLevel === "Medium"
                ? `Wait a little before buying ${itemName}. Try saving around ₹${extraSaving.toLocaleString(
                    "en-IN"
                  )} more.`
                : `You can consider buying ${itemName}, but keep tracking your savings and goals.`}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Simulator;
