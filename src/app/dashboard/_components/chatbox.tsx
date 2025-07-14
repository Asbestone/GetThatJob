"use client";

import { useState } from "react";

export default function ChatBox() {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");

    const ask = async () => {
        const res = await fetch("/api/rag", {
            method: "POST",
            body: JSON.stringify({ query }),
        });
        const data = await res.json();
        setAnswer(data.answer);
    };

    return (
        <div className="space-y-4">
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about the resumes..."
                className="w-full border p-2 rounded"
            />
            <button onClick={ask} className="bg-black text-white px-4 py-2 rounded">
                Ask
            </button>
            <div className="bg-gray-100 p-4 rounded">{answer}</div>
        </div>
    );
}
