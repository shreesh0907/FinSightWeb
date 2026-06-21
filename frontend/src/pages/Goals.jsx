import { useState } from "react";
import { apiRequest } from "../api";
import { goalDelayData } from "../data/demodata";
import { Target, Clock3, AlertTriangle } from "lucide-react";

function Goals() {
  const [formData, setFormData] = useState({
    goalAmount: 150000,
    currentSavings: 80000,
    monthlySavings: 5000,
    purchaseCost: 90000,
  });

  const [result, setResult] = useState(goalDelayData);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  };

  const calculateDelay = async (e) => {
    e.preventDefault();

    try {
      const res = await apiRequest("/goals/delay", "POST", formData);
      setResult(res.data);
    } catch {
      setResult(goalDelayData);
    }
  };

  return (
    <main className="px-6 pt-20 pb-12 md:px-16">
      <div className="mb-10 text-center">
        <p className="text-xl text-slate-300">
          See how today's purchase affects tomorrow's goals.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.5fr]">
        <form
          onSubmit={calculateDelay}
          className="rounded-3xl border border-purple-400/40 bg-[#080819]/80 p-7 shadow-[0_0_25px_rgba(168,85,247,0.16)]"
        >
          <div className="mb-6 flex items-center gap-3 text-cyan-300">
            <Target size={34} />
            <h2 className="text-2xl font-black">Goal Details</h2>
          </div>

          {[
            ["Goal Amount", "goalAmount"],
            ["Current Savings", "currentSavings"],
            ["Monthly Savings", "monthlySavings"],
            ["Purchase Cost", "purchaseCost"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="mb-2 mt-4 block text-slate-300">{label}</label>
              <input
                className="w-full rounded-2xl border border-cyan-400/30 bg-white/5 px-4 py-3 outline-none focus:border-cyan-300"
                type="number"
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <button className="mt-7 w-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-6 py-4 font-black shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:scale-[1.02]">
            Analyze Goal Impact
          </button>
        </form>

        <div className="rounded-3xl border border-cyan-400/30 bg-[#080819]/80 p-8 shadow-[0_0_25px_rgba(34,211,238,0.14)]">
          <div className="mb-7 flex items-center gap-3 text-cyan-300">
            <Clock3 size={34} />
            <h2 className="text-2xl font-black">Timeline Comparison</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex justify-between text-lg">
              <span className="text-slate-300">Without Purchase</span>
              <strong className="text-cyan-300">
                {result.withoutPurchaseMonths} Months
              </strong>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10"> <div className="h-full w-[45%] rounded-full bg-linear-to-r from-purple-500 to-cyan-400" /> </div>
          </div>


          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex justify-between text-lg">
              <span className="text-slate-300">After Purchase</span>
              <strong className="text-yellow-300">
                {result.afterPurchaseMonths} Months
              </strong>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10"> <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-yellow-400 to-rose-400" /> </div> 
          </div>

          <div className="mt-6 rounded-3xl border border-rose-400/30 bg-rose-400/10 p-8 text-center">
            <AlertTriangle size={56} className="mx-auto text-yellow-300" />

            <p className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-rose-300">
              Goal Delay
            </p>

            <h1 className="mt-3 text-5xl font-black text-rose-300">
              +{result.delayMonths} Months
            </h1>

            <p className="mt-3 text-slate-300">
              Your financial goal gets delayed if you make this purchase today.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Current Gap</p>
              <h3 className="mt-1 text-xl font-black text-cyan-300">
                ₹
                {(formData.goalAmount - formData.currentSavings).toLocaleString(
                  "en-IN"
                )}
              </h3>
            </div>

            <div className="rounded-2xl border border-yellow-300/20 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Purchase Impact</p>
              <h3 className="mt-1 text-xl font-black text-yellow-300">
                ₹{formData.purchaseCost.toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="rounded-2xl border border-purple-400/20 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Monthly Saving</p>
              <h3 className="mt-1 text-xl font-black text-purple-300">
                ₹{formData.monthlySavings.toLocaleString("en-IN")}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Goals;