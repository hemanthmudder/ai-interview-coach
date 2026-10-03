"use client";

import { useState } from "react";

type Question = {
  question: string;
  answer: string;
};

export default function InterviewClient({
  questions,
}: {
  questions: Question[];
}) {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");

  const current = questions[index];

  function handleNext() {
    setUserAnswer("");
    setIndex((value) => value + 1);
  }

  function handlePrevious() {
    setUserAnswer("");
    setIndex((value) => value - 1);
  }

  return (
    <section className="rounded-xl bg-slate-900 p-6 border border-slate-700">
      <p className="text-sm text-slate-400">
        Question {index + 1} of {questions.length}
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        {current.question}
      </h2>

      <textarea
        value={userAnswer}
        onChange={(event) => setUserAnswer(event.target.value)}
        placeholder="Type your answer here..."
        className="mt-6 w-full min-h-40 rounded-lg bg-slate-800 border border-slate-700 p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      <div className="mt-6 flex justify-between gap-3">
        <button
          className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-50"
          onClick={handlePrevious}
          disabled={index === 0}
        >
          Previous
        </button>

        <button
          className="rounded-lg bg-teal-600 px-4 py-2 disabled:opacity-50"
          onClick={handleNext}
          disabled={index === questions.length - 1}
        >
          Next
        </button>
      </div>
    </section>
  );
}