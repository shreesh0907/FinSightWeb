function ResultCard({ title, value, change, type = "neutral" }) {
  const styles = {
    danger: {
      border: "border-rose-500/20",
      bg:     "bg-rose-500/[0.07]",
      value:  "text-rose-300",
      badge:  "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    },
    warning: {
      border: "border-amber-500/20",
      bg:     "bg-amber-500/[0.07]",
      value:  "text-amber-300",
      badge:  "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    neutral: {
      border: "border-indigo-500/20",
      bg:     "bg-indigo-500/[0.07]",
      value:  "text-indigo-300",
      badge:  "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    },
  };

  const s = styles[type];

  return (
    <div className={`rounded-lg border ${s.border} ${s.bg} p-4`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
      <p className={`mt-2 text-sm font-bold ${s.value} leading-snug`}>{value}</p>
      {change && (
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>
          {change}
        </span>
      )}
    </div>
  );
}

export default ResultCard;