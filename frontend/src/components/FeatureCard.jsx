function FeatureCard({ number, icon, title, points }) {
  return (
    <div className="rounded-3xl border border-cyan-400/30 bg-[#080819]/80 p-7 shadow-[0_0_25px_rgba(168,85,247,0.22)]">
      <div className="flex items-center justify-between">
        <span className="text-xl font-black text-purple-400">{number}</span>
        <div className="text-cyan-300">{icon}</div>
      </div>

      <h3 className="mt-6 text-2xl font-black">{title}</h3>

      <ul className="mt-4 space-y-2 text-slate-300">
        {points.map((point, index) => (
          <li key={index}>✓ {point}</li>
        ))}
      </ul>
    </div>
  );
}

export default FeatureCard;