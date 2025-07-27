"use client";

import { useRef, useState, useEffect } from "react";
import { Input } from "@/app/components/frontend/ui/input";
import { Button } from "@/app/components/frontend/ui/button";
import ReactMarkdown from "react-markdown";

interface ChatMessagePart {
  text: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  parts: ChatMessagePart[];
}

const CLIENT_CONTEXT_WINDOW_SOFT_LIMIT = parseInt(
  process.env.MAX_CONTEXT_WINDOW || "5000"
);

export default function ChatBox() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [displayWarning, setDisplayWarning] = useState<string | null>(null);
  const [currentCompany, setCurrentCompany] = useState<string | undefined>(
    undefined
  );
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && !isSending) {
      setMessages([
        {
          id: "initial-greeting",
          role: "model",
          parts: [
            {
              text: "Hello! I'm here to assist you with resume analysis, job matching, and career-related questions. How can I help you today?",
            },
          ],
        },
      ]);
    }
  }, [messages.length, isSending]); // Include dependencies

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentCompany !== undefined && messages.length > 0) {
      setDisplayWarning(null);
    }
  }, [currentCompany, messages.length]);

  const resetChat = async () => {
    // Clear session on server if we have a sessionId
    if (sessionId) {
      try {
        await fetch("api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "clearSession", sessionId }),
        });
      } catch (error) {
        console.warn("Failed to clear session:", error);
      }
    }

    setMessages([
      {
        id: "initial-greeting",
        role: "model",
        parts: [
          {
            text: "Hello! I'm here to assist you with resume analysis, job matching, and career-related questions. How can I help you today?",
          },
        ],
      },
    ]);
    setQuery("");
    setDisplayWarning(null);
    setSessionId(undefined);
  };

  const ask = async () => {
    if (!query.trim() || isSending) return;

    const userMessageText = query.trim();

    // --- START FIX ---
    // 1. Create the user message object
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ text: userMessageText }],
    };

    // 2. Add the user message to the state IMMEDIATELY for instant display
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    // --- END FIX ---

    setQuery("");
    setIsSending(true);
    setDisplayWarning(null);

    // --- START FIX ---
    // 3. Prepare chatHistory for server:
    //    - Filter out 'system' roles and the 'initial-greeting' message.
    //    - IMPORTANT: DO NOT include the `userMessage` created above in this `chatHistoryForServer`.
    //      The current user's query is sent via the `query` parameter, and `rag.ts` handles it.
    //      `chatHistory` here is strictly for *past* conversational turns.
    const chatHistoryForServer = messages.filter(
      (msg) => msg.role !== "system" && msg.id !== "initial-greeting"
    );
    // --- END FIX ---

    const contextLength =
      JSON.stringify(chatHistoryForServer).length + userMessageText.length;

    if (contextLength > CLIENT_CONTEXT_WINDOW_SOFT_LIMIT) {
      setDisplayWarning(
        `Heads up! Your message history is getting long. You might hit the server's context limit. Consider clearing the chat. 🟠`
      );
    }

    try {
      const response = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessageText,
          chatHistory: chatHistoryForServer,
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get answer");
      }

      const data = await response.json();

      // --- START FIX ---
      // 4. When the response comes back, only append the AI's new message.
      //    The `data.updatedChatHistory` from the server will contain the full history
      //    including the user's message and the AI's new response.
      //    The AI's new response is always the last element in `data.updatedChatHistory`.
      const newAIResponse =
        data.updatedChatHistory[data.updatedChatHistory.length - 1];

      setMessages((prevMessages) => {
        // If it's the very first user message, `prevMessages` currently looks like:
        // `[initial-greeting, userMessage]`
        // And `newAIResponse` is the first AI response.
        // If it's a subsequent message, `prevMessages` looks like:
        // `[initial-greeting, user1, model1, user2, model2, userMessage]`
        // We just need to append the `newAIResponse`.
        return [...prevMessages, newAIResponse];
      });
      // --- END FIX ---

      setCurrentCompany(data.targetCompany);
      setSessionId(data.sessionId); // Store session ID
    } catch (error: unknown) {
      console.error("❌ Chat error:", error);
      const errorMessageText =
        error instanceof Error ? error.message : "An unknown error occurred";

      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "model",
        parts: [{ text: `Error: ${errorMessageText}` }],
      };

      // --- START FIX ---
      // 5. When an error occurs, append only the error message.
      //    The user's message is already displayed.
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      // --- END FIX ---
      setDisplayWarning(`Server Error: ${errorMessageText} 🚨`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-[500px]">
      <h2 className="text-2xl font-semibold text-black mb-4">
        Chat with AI Assistant 🤖
      </h2>

      {/* Chat History Display */}
      <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md p-4 space-y-4 mb-4">
        {messages.map((msg) => {
          // optionally skip rendering 'system' role messages
          if (msg.role === "system") return null;

          return (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.parts.map((part, partIndex) => (
                  <div key={partIndex}>
                    {msg.role === "model" ? (
                      <div className="prose prose-sm max-w-none text-gray-800">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc pl-4 mb-2">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-4 mb-2">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="mb-1">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-bold">{children}</strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic">{children}</em>
                            ),
                            code: ({ children }) => (
                              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span>{part.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-200 text-gray-800">
              <div className="animate-pulse">...thinking</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {displayWarning && (
        <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded mb-4">
          {displayWarning}
        </div>
      )}

      {/* Chat Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isSending) {
              ask();
            }
          }}
          placeholder={isSending ? "Thinking..." : "Type your message..."}
          disabled={isSending}
          className="flex-1"
        />

        <Button onClick={ask} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </Button>
        <Button onClick={resetChat} disabled={isSending} variant="outline">
          Clear Chat
        </Button>
      </div>
    </div>
  );
}
