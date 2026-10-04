"use client";

import { useState } from "react";

type Question = {
  question: string;
  answer: string;
};
type EvaluationResult = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
};
export default function InterviewClient({
  questions,
}: {
  questions: Question[];
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );

  const [result, setResult] = useState<EvaluationResult | null>(null);

  const current = questions[index];
  const userAnswer = answers[index];

  function handleAnswerChange(value: string) {
    setAnswers((previousAnswers) => {
      const updatedAnswers = [...previousAnswers];

      updatedAnswers[index] = value;

      return updatedAnswers;
    });
  }

  function handleNext() {
    setIndex((value) => value + 1);
  }

  function handlePrevious() {
    setIndex((value) => value - 1);
  }

  async function handleSubmit() {
  try {
    const response = await fetch("/api/interview/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questions,
        answers,
      }),
    });

    const data = await response.json();

console.log("API status:", response.status);
console.log("API response:", data);

    if (!response.ok) {
      console.error("API request failed");
      return;
    }
    setResult(data.result);
    
  } catch (error) {
    console.error("Failed to submit interview:", error);
  }
}
  if (result) {
  return (
    <section className="rounded-xl bg-slate-900 p-6 border border-slate-700">
      <h2 className="text-2xl font-semibold">
        Interview Results
      </h2>

      <div className="mt-6">
        <p className="text-slate-400">Score</p>
        <p className="text-4xl font-bold text-teal-400">
          {result.score}%
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">
          Strengths
        </h3>

        <ul className="mt-2 list-disc pl-5 text-slate-300">
          {result.strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">
          Weaknesses
        </h3>

        <ul className="mt-2 list-disc pl-5 text-slate-300">
          {result.weaknesses.map((weakness, index) => (
            <li key={index}>{weakness}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">
          Feedback
        </h3>

        <p className="mt-2 text-slate-300">
          {result.feedback}
        </p>
      </div>
    </section>
  );
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
        onChange={(event) => handleAnswerChange(event.target.value)}
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

        {index === questions.length - 1 ? (
          <button
            className="rounded-lg bg-teal-600 px-4 py-2"
            onClick={handleSubmit}
          >
            Submit Interview
          </button>
        ) : (
          <button
            className="rounded-lg bg-teal-600 px-4 py-2"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </section>
  );
}