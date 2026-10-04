"use client";

import { useState } from "react";

type Question = {
  question: string;
  answer: string;
};
type QuestionResult = {
  question: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
};

type EvaluationResult = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  questionResults: QuestionResult[];
};
function ScoreGauge({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, Number.isFinite(score) ? score : 0));

  // ---- Geometry ----
  const CX = 150;
  const CY = 150;
  const R = 110; // arc radius
  const START_ANGLE = 135; // bottom-left (SVG degrees, clockwise)
  const SWEEP = 270; // total sweep

  const polar = (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: CX + Math.cos(rad) * r, y: CY + Math.sin(rad) * r };
  };

  // Arc between two scores (0-100)
  const arcPath = (from: number, to: number) => {
    const a1 = START_ANGLE + (from / 100) * SWEEP;
    const a2 = START_ANGLE + (to / 100) * SWEEP;
    const p1 = polar(a1, R);
    const p2 = polar(a2, R);
    const largeArc = a2 - a1 > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${R} ${R} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
  };

  // ---- Zones (match the status thresholds) ----
  const zones = [
    { from: 0, to: 40, color: "#ef4444" }, // Poor
    { from: 40, to: 60, color: "#f97316" }, // Needs Improvement
    { from: 60, to: 80, color: "#eab308" }, // Good
    { from: 80, to: 100, color: "#14b8a6" }, // Excellent
  ];

  const status =
    safeScore >= 80
      ? { label: "Excellent", desc: "Strong interview performance", color: "#14b8a6" }
      : safeScore >= 60
      ? { label: "Good", desc: "Good foundation, but there is room to improve", color: "#eab308" }
      : safeScore >= 40
      ? { label: "Needs Improvement", desc: "Focus on strengthening your fundamentals", color: "#f97316" }
      : { label: "Poor", desc: "Significant improvement is needed", color: "#ef4444" };

  // Needle: -135° (score 0) -> +135° (score 100), 0° points straight up
  const needleAngle = -135 + (safeScore / 100) * SWEEP;

  // ---- Ticks (outside the arc) ----
  const ticks = Array.from({ length: 21 }, (_, i) => {
    const major = i % 5 === 0;
    const angle = START_ANGLE + i * (SWEEP / 20);
    const outer = polar(angle, 134);
    const inner = polar(angle, major ? 125 : 129);
    return { ...inner, x2: outer.x, y2: outer.y, major };
  });

  // ---- Labels (0, 25, 50, 75, 100) ----
  const labels = [0, 25, 50, 75, 100].map((value) => {
    const { x, y } = polar(START_ANGLE + (value / 100) * SWEEP, 150);
    return { value, x, y };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[340px]">
        <svg viewBox="-10 -10 320 280" className="h-auto w-full overflow-visible">
          {/* Track */}
          <path
            d={arcPath(0, 100)}
            fill="none"
            stroke="#1e293b"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Colored zones */}
          {zones.map((zone) => (
            <path
              key={zone.from}
              d={arcPath(zone.from, zone.to)}
              fill="none"
              stroke={zone.color}
              strokeWidth="24"
              strokeLinecap="butt"
              opacity={0.95}
            />
          ))}

          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x}
              y1={t.y}
              x2={t.x2}
              y2={t.y2}
              stroke="#cbd5e1"
              strokeWidth={t.major ? 3 : 1.5}
              strokeLinecap="round"
              opacity={t.major ? 1 : 0.6}
            />
          ))}

          {/* Score labels */}
          {labels.map((l) => (
            <text
              key={l.value}
              x={l.x}
              y={l.y}
              fill="#94a3b8"
              fontSize="13"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {l.value}
            </text>
          ))}

          {/* Needle */}
          <g
            style={{
              transform: `rotate(${needleAngle}deg)`,
              transformOrigin: `${CX}px ${CY}px`,
              transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={CY - 88}
              stroke="#f8fafc"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={CY - 82}
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Center pivot */}
          <circle cx={CX} cy={CY} r="13" fill="#0f172a" stroke="#e2e8f0" strokeWidth="4" />
          <circle cx={CX} cy={CY} r="5" fill={status.color} />

          {/* Score inside the gauge gap */}
          <text
            x={CX}
            y={CY + 62}
            fill="#ffffff"
            fontSize="36"
            fontWeight="700"
            textAnchor="middle"
          >
            {Math.round(safeScore)}%
          </text>
        </svg>
      </div>

      {/* Performance status */}
      <div className="text-center">
        <p className="text-xl font-semibold" style={{ color: status.color }}>
          {status.label}
        </p>
        <p className="mt-1 text-sm text-slate-400">{status.desc}</p>
      </div>
    </div>
  );
}
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

      <div className="mt-6 flex justify-center">
  <ScoreGauge score={result.score} />
</div>

            <div className="mt-8">
        <h3 className="text-xl font-semibold">
          Question-by-Question Evaluation
        </h3>

        <div className="mt-4 space-y-6">
          {result.questionResults.map((questionResult, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-700 bg-slate-800 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-lg font-semibold">
                  Q{index + 1}. {questionResult.question}
                </h4>

                <span className="shrink-0 font-semibold text-teal-400">
                  {questionResult.score}/10
                </span>
              </div>

              <div className="mt-4">
                <h5 className="font-medium text-slate-200">
                  Strengths
                </h5>

                <ul className="mt-2 list-disc pl-5 text-slate-300">
                  {questionResult.strengths.map((strength, strengthIndex) => (
                    <li key={strengthIndex}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h5 className="font-medium text-slate-200">
                  What to improve
                </h5>

                <ul className="mt-2 list-disc pl-5 text-slate-300">
                  {questionResult.weaknesses.map(
                    (weakness, weaknessIndex) => (
                      <li key={weaknessIndex}>{weakness}</li>
                    )
                  )}
                </ul>
              </div>

              <div className="mt-4">
                <h5 className="font-medium text-slate-200">
                  AI Feedback
                </h5>

                <p className="mt-2 text-slate-300">
                  {questionResult.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>
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