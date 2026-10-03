import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { questions, answers } = body;

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

    console.log("Received interview:");
    console.log({
      questions,
      answers,
    });

    return NextResponse.json({
      success: true,
      message: "Interview received successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}