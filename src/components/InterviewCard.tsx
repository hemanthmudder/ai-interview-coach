export default function InterviewCard() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="text-xl font-bold text-white">
        Frontend Developer
      </h2>

      <p className="mt-2 text-slate-400">
        React, Next.js
      </p>

      <p className="mt-4 text-blue-400">
        25 Questions
      </p>

      <button className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Start Interview
      </button>
    </div>
  );
}