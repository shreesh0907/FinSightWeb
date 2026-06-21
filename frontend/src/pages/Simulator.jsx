import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { simulationResult } from "../data/demodata";
import { apiRequest } from "../api";
import { Laptop, Bot, ShieldAlert } from "lucide-react";

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
    <main className="px-6 pt-20 pb-12 md:px-16">
      <div className="mb-10 text-center">
        <p className="text-xl text-slate-300">
          Understand the financial consequences before you buy.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.6fr_0.95fr]">
        <form
          onSubmit={handleSimulate}
          className="rounded-3xl border border-purple-400/40 bg-[#080819]/80 p-6 shadow-[0_0_25px_rgba(168,85,247,0.22)]"
        >
          <div className="mb-6 flex items-center gap-3 text-cyan-300">
            <Laptop size={34} />
            <h2 className="text-2xl font-black">Your Purchase</h2>
          </div>

          {[
            ["Item Name", "itemName", "text"],
            ["Cost", "cost", "number"],
            ["Current Savings", "currentSavings", "number"],
            ["Monthly Allowance", "monthlyAllowance", "number"],
          ].map(([label, name, type]) => (
            <div key={name}>
              <label className="mb-2 mt-4 block text-slate-300">{label}</label>
              <input
                className="w-full rounded-2xl border border-cyan-400/30 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300"
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <label className="mb-2 mt-4 block text-slate-300">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-2xl border border-cyan-400/30 bg-[#080819] px-4 py-3 outline-none focus:border-cyan-300"
          >
            <option>Gadget</option>
            <option>Course</option>
            <option>Subscription</option>
            <option>Lifestyle</option>
          </select>

          <button className="mt-7 w-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-6 py-4 font-black shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:scale-[1.02]">
            {loading ? "Analyzing..." : "Analyze Financial Impact"}
          </button>
        </form>

        <div className="rounded-3xl border border-cyan-400/30 bg-[#080819]/80 p-7 shadow-[0_0_25px_rgba(34,211,238,0.18)]">
          <div className="mb-6 flex items-center gap-3 text-cyan-300">
            <Bot size={34} />
            <h2 className="text-2xl font-black">Impact Analysis</h2>
          </div>

          <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-white/5 p-5">
            <div className="mb-2 flex justify-between text-sm text-slate-400">
              <span>Financial Health</span>
              <span>
                {result.healthScoreBefore} → {result.healthScoreAfter}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                style={{ width: `${result.healthScoreAfter}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-400">
              Your financial health score drops after this purchase.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <ResultCard
              title="Savings"
              value={`₹${result.beforeSavings.toLocaleString(
                "en-IN"
              )} → ₹${result.afterSavings.toLocaleString("en-IN")}`}
              change={`${result.savingsReductionPercent}% reduction`}
              type="danger"
            />

            <ResultCard
              title="Emergency Fund"
              value={`${result.emergencyFundBefore} → ${result.emergencyFundAfter} Months`}
              change="Safety net reduced"
              type="warning"
            />

            <ResultCard
              title="Health Score"
              value={`${result.healthScoreBefore} → ${result.healthScoreAfter}`}
              change="Score decreased"
              type="neutral"
            />

            <ResultCard
              title="Goal Delay"
              value={`+${result.goalDelayMonths} Months`}
              change="Goal delayed"
              type="danger"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-3xl border border-yellow-300/30 bg-[#080819]/80 p-7">
          <div className="text-center">
            <ShieldAlert size={60} className="mx-auto text-yellow-300" />
            <h2 className="mt-5 text-2xl font-black">AI Recommendation</h2>

            <div className="my-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/5 p-5">
              <p className="text-sm text-slate-400">Risk Level</p>
              <h1 className="mt-2 text-5xl font-black text-yellow-300">
                {result.riskLevel}
              </h1>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-slate-300">
            <p>• Delays your selected goal by {result.goalDelayMonths} months.</p>
            <p>
              • Reduces emergency fund from {result.emergencyFundBefore} to{" "}
              {result.emergencyFundAfter} months.
            </p>
            <p>
              • Health score drops by{" "}
              {result.healthScoreBefore - result.healthScoreAfter} points.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-white/5 p-4">
            <p className="text-sm font-bold text-cyan-300">Recommendation</p>
            <p className="mt-2 text-slate-300">
              Wait 3 months and save ₹15,000 more before purchasing this item.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Simulator;