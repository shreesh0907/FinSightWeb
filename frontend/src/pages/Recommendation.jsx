import { useState } from "react";
import { apiRequest } from "../api";
import { recommendationData } from "../data/demodata";
import { Bot, Sparkles, BadgeCheck } from "lucide-react";

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

  return (
    <main className="px-6 pt-20 pb-12 md:px-16">
      <div className="mb-10 text-center">
        <p className="text-xl text-slate-300">
          Beyond analysis. Actionable financial guidance.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.2fr_1fr]">
        <div className="rounded-3xl border border-purple-400/40 bg-[#080819]/80 p-7 shadow-[0_0_25px_rgba(168,85,247,0.16)]">
          <h2 className="mb-5 text-2xl font-black text-purple-300">
            User Scenario
          </h2>

          {[
            ["Purchase", "MacBook Air"],
            ["Cost", "₹90,000"],
            ["Goal", "Higher Studies Fund"],
            ["Health Score", "68/100"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between border-b border-white/10 py-4"
            >
              <span className="text-slate-300">{label}</span>
              <strong>{value}</strong>
            </div>
          ))}

          <button
            onClick={getRecommendation}
            className="mt-7 w-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 px-6 py-4 font-black shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:scale-[1.02]"
          >
            {loading ? "Thinking..." : "Generate Advice"}
          </button>
        </div>

        <div className="rounded-3xl border border-cyan-400/30 bg-[#080819]/80 p-8 text-center shadow-[0_0_25px_rgba(34,211,238,0.14)]">
          <Bot size={76} className="mx-auto text-cyan-300" />

          <h2 className="mt-5 text-2xl font-black">AI Decision</h2>

          <div className="my-8 rounded-3xl border border-green-400/30 bg-green-400/10 p-7">
            <BadgeCheck size={48} className="mx-auto text-green-400" />

            <h1 className="mt-4 text-4xl font-black text-green-400">
              {result.decision}
            </h1>
          </div>

          <p className="leading-7 text-slate-300">{result.summary}</p>
        </div>

        <div className="rounded-3xl border border-green-400/30 bg-[#080819]/80 p-7 shadow-[0_0_25px_rgba(34,197,94,0.12)]">
          <div className="mb-6 flex items-center gap-3 text-cyan-300">
            <Sparkles size={34} />
            <h2 className="text-2xl font-black">Smart Suggestions</h2>
          </div>

          <ul className="space-y-5">
            {result.recommendations.map((item, index) => (
              <li key={index} className="flex gap-3 text-slate-200">
                <BadgeCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-green-400"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Recommendation;