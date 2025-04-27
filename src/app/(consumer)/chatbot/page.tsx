// pages/chatbot.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatbotPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Failed to fetch answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 mt-10">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">🤖 AI Programming Assistant</h1>

        <div className="flex flex-col space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your programming question here..."
            className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-black bg-gray-100"
            rows={5}
          />

          <button
            onClick={askQuestion}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Thinking..." : "Ask Question"}
          </button>
        </div>

        {answer && (
          <div className="mt-8 p-6 rounded-xl bg-gray-100 border border-gray-300">
            <h2 className="font-bold text-lg mb-3 text-gray-700">Answer:</h2>
            <p className="text-gray-800 whitespace-pre-line">{answer}</p>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
