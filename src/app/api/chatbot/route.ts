// src/app/api/chatbot/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { question } = await request.json();

  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

    const programmingKeywords = ["python", "dotnet", "c#", "javascript", "programming", "coding", "development", "backend", "frontend"];
    const lowerCaseQuestion = question.toLowerCase();

    const isProgrammingRelated = programmingKeywords.some((keyword) =>
      lowerCaseQuestion.includes(keyword)
    );

    if (!isProgrammingRelated) {
      return NextResponse.json({ answer: "❗ Please ask only programming-related questions!" });
    }

    const response = await axios.post(url, {
      contents: [
        { parts: [{ text: `Answer this programming course related question: ${question}` }] },
      ],
    });

    const botAnswer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";

    return NextResponse.json({ answer: botAnswer });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred.");
    }

    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
