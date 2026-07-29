type DashboardCardProps = {
  title: string;
  description: string;
};

export default function DashboardCard({
  title,
  description,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-lg hover:border-blue-500 hover:scale-105 transition-all duration-500 cursor-pointer">
      <h2 className="text-2xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-1 text-gray-400">
        {description}
      </p>
    </div>
  );
}