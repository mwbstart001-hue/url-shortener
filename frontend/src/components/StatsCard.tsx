interface StatsCardProps {
  icon: string;
  title: string;
  description: string;
}

export function StatsCard({ icon, title, description }: StatsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-center transform hover:-translate-y-1 transition-all duration-300">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/60">{description}</p>
    </div>
  );
}
