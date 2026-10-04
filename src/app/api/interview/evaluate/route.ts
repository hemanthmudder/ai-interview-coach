import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type InterviewQuestion = {
  question: string;
  answer: string;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

    const interview = questions.map((question, index) => ({
      question: question.question,
      answer: answers[index],
    }));

    const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's interview answers carefully.

You must judge the actual quality of the answers.
Do NOT give a high score simply because an answer exists.

Consider:
1. Technical correctness
2. Relevance to the question
3. Completeness
4. Clarity
5. Depth of understanding

Here is the interview:

${JSON.stringify(interview, null, 2)}

Return ONLY valid JSON.

Use exactly this structure:

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "feedback": "",
  "questionResults": [
    {
      "question": "",
      "score": 0,
      "strengths": [],
      "weaknesses": [],
      "feedback": ""
    }
  ]
}

Rules:
- "score" must be an integer from 0 to 100.
- Each question score must be an integer from 0 to 10.
- strengths and weaknesses must be arrays of strings.
- feedback must be a useful explanation.
- Evaluate every question.
- Empty answers should receive a very low score.
- Incorrect answers should not receive high scores.
- Do not invent information about the candidate.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      return NextResponse.json(
        { error: "AI returned an empty response." },
        { status: 500 }
      );
    }

    const result = JSON.parse(text);

    console.log("AI Interview Evaluation:");
    console.log(result);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("AI evaluation error:", error);

    return NextResponse.json(
      { error: "Failed to evaluate interview." },
      { status: 500 }
    );
  }
}