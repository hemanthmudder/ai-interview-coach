import { NextResponse } from "next/server";

type InterviewQuestion = {
  question: string;
  answer: string;
};

function evaluateInterview(answers: string[]) {
  const answeredCount = answers.filter(
    (answer) => answer.trim().length > 0
  ).length;

  const totalQuestions = answers.length;

  const score =
    totalQuestions === 0
      ? 0
      : Math.round((answeredCount / totalQuestions) * 100);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (answeredCount === totalQuestions) {
    strengths.push("Answered all interview questions.");
  } else {
    weaknesses.push("Some interview questions were left unanswered.");
  }

  if (answeredCount >= Math.ceil(totalQuestions * 0.7)) {
    strengths.push("Good interview participation.");
  } else {
    weaknesses.push("Try to provide more complete answers.");
  }

  const feedback =
    score >= 80
      ? "Good attempt. Focus on making your answers more precise and technically detailed."
      : score >= 50
      ? "Decent attempt. Try to provide complete and technically stronger answers."
      : "You need to provide more complete answers to improve your interview performance.";

  return {
    score,
    strengths,
    weaknesses,
    feedback,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      questions,
      answers,
    }: {
      questions: InterviewQuestion[];
      answers: string[];
    } = body;

    if (!questions || !answers) {
      return NextResponse.json(
        { error: "Questions and answers are required." },
        { status: 400 }
      );
    }

    if (questions.length !== answers.length) {
      return NextResponse.json(
        { error: "Questions and answers count do not match." },
        { status: 400 }
      );
    }

    const result = evaluateInterview(answers);

    console.log("Interview evaluation:");
    console.log(result);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}