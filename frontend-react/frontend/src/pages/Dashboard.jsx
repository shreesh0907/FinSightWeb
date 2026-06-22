import { useEffect, useState } from "react";
import {
  BarChart2, Wallet, Target, AlertCircle,
  Bot, TrendingUp, TrendingDown, Activity,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  dashboardData, savingsTrend, spendingBreakdown,
  healthScoreHistory, goalProgress, monthlyAllowanceVsExpense,
} from "../data/demodata";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";

const ChartTip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-[#13131f] px-3 py-2 shadow-xl text-sm">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-semibold" style={{ color: p.color }}>
          {prefix}
          {typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
          {suffix}
        </p>
      ))}
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-white/[0.07] bg-[#0f0f1c]/90 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ icon: Icon, title, accent = "text-indigo-400" }) => (
  <div className="mb-5 flex items-center gap-2">
    <Icon size={16} className={accent} />
    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</h2>
  </div>
);

const gridStyle = { stroke: "rgba(255,255,255,0.05)" };
const tickStyle = { fill: "#475569", fontSize: 11 };
const axisProps = { axisLine: false, tickLine: false };

function Dashboard() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiRequest("/dashboard", "GET", null, token);
        setDashboard(res.data);
      } catch (err) {
        console.error("Dashboard API error:", err.message);
      }
    };

    if (token) fetchDashboard();
  }, [token]);

  const displayData = dashboard || dashboardData;

  const liveGoalProgress =
    dashboard?.goals?.map((goal) => ({
      name: goal.name,
      target: Number(goal.targetAmount || goal.target_amount || 0),
      saved: Number(goal.currentAmount || goal.current_amount || 0),
    })) || goalProgress;

  const kpis = [
    {
      icon: BarChart2,
      label: "Health Score",
      value: `${displayData.healthScore}/100`,
      delta: dashboard ? "Live from backend" : "Demo data",
      up: null,
    },
    {
      icon: Wallet,
      label: "Current Savings",
      value: `₹${displayData.currentSavings.toLocaleString("en-IN")}`,
      delta: dashboard ? "Live from backend" : "+₹25,000 this month",
      up: true,
    },
    {
      icon: Target,
      label: "Active Goals",
      value: `${displayData.activeGoals} goals`,
      delta: dashboard ? "Live from backend" : "In progress",
      up: true,
    },
    {
      icon: AlertCircle,
      label: "Risk Level",
      value: displayData.riskLevel,
      delta: dashboard ? "Live from backend" : "Stable since May",
      up: null,
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Financial Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Your complete financial picture at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ icon: Icon, label, value, delta, up }) => (
          <Card key={label} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <Icon size={15} className="text-slate-600" />
            </div>

            <p className="text-2xl font-bold text-white">{value}</p>

            <p
              className={`flex items-center gap-1 text-xs font-medium ${
                up === null ? "text-slate-500" : up ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {up === true && <TrendingUp size={11} />}
              {up === false && <TrendingDown size={11} />}
              {delta}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardTitle icon={TrendingUp} title="Savings Trend — Last 6 Months" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={savingsTrend} margin={{ left: -8 }}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={tickStyle} {...axisProps} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={tickStyle} {...axisProps} />
              <Tooltip content={<ChartTip prefix="₹" />} />

              <Area
                type="monotone"
                dataKey="savings"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#sg)"
                dot={{ r: 3.5, fill: "#6366f1", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle icon={Wallet} title="Spending Breakdown" accent="text-sky-400" />
          <ResponsiveContainer width="100%" height={178}>
            <PieChart>
              <Pie
                data={spendingBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={76}
                paddingAngle={3}
                dataKey="value"
              >
                {spendingBreakdown.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                contentStyle={{
                  background: "#13131f",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
            {spendingBreakdown.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full inline-block" style={{ background: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardTitle icon={Activity} title="Financial Health Score" accent="text-emerald-400" />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={healthScoreHistory} margin={{ left: -8 }}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={tickStyle} {...axisProps} />
              <YAxis domain={[50, 100]} tick={tickStyle} {...axisProps} />
              <Tooltip content={<ChartTip suffix="/100" />} />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3.5, fill: "#10b981", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle icon={BarChart2} title="Allowance vs Expense" accent="text-amber-400" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyAllowanceVsExpense} margin={{ left: -8 }} barGap={3}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={tickStyle} {...axisProps} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={tickStyle} {...axisProps} />
              <Tooltip content={<ChartTip prefix="₹" />} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b", paddingTop: "8px" }} />

              <Bar dataKey="allowance" name="Allowance" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="expense" name="Expense" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardTitle
            icon={Target}
            title={dashboard ? "Goal Progress (Live)" : "Goal Progress"}
          />

          <div className="space-y-5 mb-6">
            {liveGoalProgress.map(({ name, target, saved }) => {
              const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;

              return (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-300">{name}</span>
                    <span className="text-slate-500">
                      ₹{saved.toLocaleString("en-IN")} / ₹{target.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-600">{pct}% complete</p>
                </div>
              );
            })}
          </div>

          <ResponsiveContainer width="100%" height={130}>
            <BarChart layout="vertical" data={liveGoalProgress} margin={{ left: 0, right: 8 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={105}
                tick={{ fill: "#475569", fontSize: 11 }}
                {...axisProps}
              />

              <Tooltip
                formatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                contentStyle={{
                  background: "#13131f",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontSize: "12px",
                }}
              />

              <Bar dataKey="saved" name="Saved" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={16} />
              <Bar dataKey="target" name="Target" fill="rgba(255,255,255,0.06)" radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle icon={Bot} title="AI Recommendation" accent="text-emerald-400" />

          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-4 mb-4">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">
              Latest advice
            </p>
            <p className="text-lg font-bold text-white">Wait 3 Months</p>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              Saving ₹15,000 more before purchasing reduces your goal delay
              and keeps your emergency fund intact.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm text-slate-400 mb-5">
            {[
              "Avoids reducing savings too sharply.",
              "Keeps emergency fund above safe levels.",
              "Improves long-term goal stability.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500 shrink-0">✓</span>
                {tip}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Health Drop", val: "82 → 68", cls: "text-rose-400" },
              { label: "Goal Delay", val: "+18 mo.", cls: "text-amber-400" },
              { label: "Savings Left", val: "₹30,000", cls: "text-indigo-300" },
              { label: "Risk Level", val: "Medium", cls: "text-slate-300" },
            ].map(({ label, val, cls }) => (
              <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                <p className="text-xs text-slate-600">{label}</p>
                <p className={`mt-0.5 font-bold text-sm ${cls}`}>{val}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Dashboard;
