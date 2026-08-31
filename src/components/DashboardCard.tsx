import Link from "next/link";
type DashboardCardProps = {
  title: string;
  description: string;
  slug: string;
};

export default function DashboardCard({
  title,
  description,
  slug,
}: DashboardCardProps) {
  return (
    <Link href={`/dashboard/${slug}`}>
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-lg hover:border-blue-500 hover:scale-105 transition-all duration-500 cursor-pointer">
        <h2 className="text-2xl font-bold">{title}</h2>

        <p className="mt-2 text-slate-400">
          {description}
        </p>
      </div>
    </Link>
  );
}