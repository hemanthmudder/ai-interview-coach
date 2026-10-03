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
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );

  const [submitted, setSubmitted] = useState(false);

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
    const response = await fetch("/api/civicfix/interview/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questions,
        answers,
      }),
    });

    const text = await response.text();

    console.log("API status:", response.status);
    console.log("API response:", text);

    if (!response.ok) {
      console.error("API request failed");
      return;
    }

    setSubmitted(true);
  } catch (error) {
    console.error("Failed to submit interview:", error);
  }
}
  if (submitted) {
    return (
      <section className="rounded-xl bg-slate-900 p-6 border border-slate-700">
        <h2 className="text-2xl font-semibold">
          Interview Submitted
        </h2>

        <p className="mt-3 text-slate-400">
          Your answers have been collected successfully.
        </p>
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