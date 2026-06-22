function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="rounded-3xl border border-cyan-400/30 bg-[#080819]/80 p-6 shadow-[0_0_25px_rgba(168,85,247,0.22)]">
      <div className="mb-4 text-cyan-300">{icon}</div>
      <p className="text-sm text-slate-300">{title}</p>
      <h2 className="mt-2 text-3xl font-black">{value}</h2>
      {subtitle && (
        <span className="mt-2 inline-block text-sm font-bold text-purple-400">
          {subtitle}
        </span>
      )}
    </div>
  );
}

export default StatCard;