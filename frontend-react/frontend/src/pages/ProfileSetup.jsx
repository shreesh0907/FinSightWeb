import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

function ProfileSetup() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    collegeYear: "1st Year",
    monthlyIncome: "",
    currentSavings: "",
    monthlyExpenses: "",
    goalName: "",
    targetAmount: "",
    currentAmount: "",
    monthlySaving: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const profileData = {
      collegeYear: form.collegeYear,
      monthlyIncome: Number(form.monthlyIncome),
      currentSavings: Number(form.currentSavings),
      monthlyExpenses: Number(form.monthlyExpenses),
      financialGoals: [
        {
          name: form.goalName || "Emergency Fund",
          targetAmount: Number(form.targetAmount),
          currentAmount: Number(form.currentAmount),
          monthlySaving: Number(form.monthlySaving),
        },
      ],
    };

    try {
      await apiRequest("/profile", "POST", profileData, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Profile setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-black text-white">Complete Your Profile</h1>
        <p className="mt-2 text-slate-400">
          Add your financial details so FinSight can personalize your dashboard.
        </p>

        {error && (
          <p className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-400">College Year</label>
            <select
              value={form.collegeYear}
              onChange={(e) => updateField("collegeYear", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            >
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">Monthly Income / Allowance</label>
            <input
              type="number"
              required
              value={form.monthlyIncome}
              onChange={(e) => updateField("monthlyIncome", e.target.value)}
              placeholder="15000"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">Current Savings</label>
            <input
              type="number"
              required
              value={form.currentSavings}
              onChange={(e) => updateField("currentSavings", e.target.value)}
              placeholder="50000"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">Monthly Expenses</label>
            <input
              type="number"
              required
              value={form.monthlyExpenses}
              onChange={(e) => updateField("monthlyExpenses", e.target.value)}
              placeholder="9000"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <h2 className="text-lg font-bold text-white">First Financial Goal</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              value={form.goalName}
              onChange={(e) => updateField("goalName", e.target.value)}
              placeholder="Goal name e.g. Laptop"
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />

            <input
              type="number"
              required
              value={form.targetAmount}
              onChange={(e) => updateField("targetAmount", e.target.value)}
              placeholder="Target amount"
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />

            <input
              type="number"
              required
              value={form.currentAmount}
              onChange={(e) => updateField("currentAmount", e.target.value)}
              placeholder="Already saved"
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />

            <input
              type="number"
              required
              value={form.monthlySaving}
              onChange={(e) => updateField("monthlySaving", e.target.value)}
              placeholder="Monthly saving"
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 disabled:opacity-60"
        >
          {loading ? "Saving Profile..." : "Save Profile"}
        </button>
      </form>
    </main>
  );
}

export default ProfileSetup;