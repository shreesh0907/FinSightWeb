function ResultCard({ title, value, change, type = "neutral" }) {
  const colors = {
    danger: "text-rose-400 border-rose-400/30 bg-rose-400/5",
    warning: "text-yellow-300 border-yellow-300/30 bg-yellow-300/5",
    neutral: "text-cyan-300 border-cyan-300/30 bg-cyan-300/5",
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[type]}`}>
      <p className="text-sm text-slate-300">{title}</p>
      <h3 className="mt-2 text-xl font-black">{value}</h3>
      {change && <span className="mt-2 block text-sm">{change}</span>}
    </div>
  );
}

export default ResultCard;