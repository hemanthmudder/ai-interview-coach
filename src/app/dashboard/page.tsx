import InterviewCard from "@/components/InterviewCard";
import DashboardCard from "@/components/DashboardCard";
import { dashboardFeatures } from "@/data/dashboardFeatures";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold">
          AI Interview Coach Dashboard
        </h1>
        <InterviewCard />

        <p className="mt-3 text-gray-400 text-lg">
          Welcome back! Choose a feature to continue your interview preparation.
        </p>

        <div className="grid gap-6 mt-10 md:grid-cols-2">
          
          {dashboardFeatures.map((feature) => (
            <DashboardCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              slug={feature.slug}
             />
          ))}
        </div>
      </div>
    </main>
  );
}