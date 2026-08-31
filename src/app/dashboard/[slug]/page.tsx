import { dashboardFeatures } from "@/data/dashboardFeatures";
import { interviewQuestions } from "@/data/interviewQuestions";
import InterviewClient from "@/components/InterviewClient";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function InterviewPage({ params }: Props) {
  const { slug } = await params;

  const interview = dashboardFeatures.find(
    (item) => item.slug === slug
  );

  if (!interview) {
    notFound();
  }

  const questions =
    interviewQuestions[slug as keyof typeof interviewQuestions];

  if (!questions) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">
          {interview.title} Interview
        </h1>

        <p className="text-slate-400">
          {interview.description}
        </p>

        <div className="rounded-xl bg-slate-900 p-6 border border-slate-700">
          <p>
            <span className="font-semibold">Difficulty:</span>{" "}
            {interview.difficulty}
          </p>

          <p className="mt-3">
            <span className="font-semibold">Questions:</span>{" "}
            {interview.questions}
          </p>
        </div>

        <InterviewClient questions={questions} />
      </div>
    </main>
  );
}