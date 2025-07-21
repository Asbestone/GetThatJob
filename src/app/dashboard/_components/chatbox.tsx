"use client";

import { useRef, useState, useEffect } from "react";
import { Input } from "@/app/components/frontend/ui/input";
import { Button } from "@/app/components/frontend/ui/button";

interface ChatMessagePart {
    text: string;
}

interface ChatMessage {
    id: string;
    role: "user" | "model" | "system";
    parts: ChatMessagePart[];
}

const CLIENT_CONTEXT_WINDOW_SOFT_LIMIT = parseInt(process.env.MAX_CONTEXT_WINDOW || "5000")

export default function ChatBox() {
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isSending, setIsSending] = useState(false)
    const [displayWarning, setDisplayWarning] = useState<string|null>(null)
    const [currentCompany, setCurrentCompany] = useState<string|undefined>(undefined)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (currentCompany !== undefined && messages.length > 0) {
            //setMessages(messages.slice(-2)) // keep last two messages
            setDisplayWarning(null)
        }
    }, [currentCompany])

    const resetChat = () => {
        setMessages([])
        setQuery("")
        setDisplayWarning(null)
    }

    const ask = async () => {
        if (!query.trim() || isSending) return

        const userMessageText = query.trim()
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            parts: [{ text: userMessageText }]
        }

        setMessages((prevMessages) => [...prevMessages, userMessage])
        setQuery("")
        setIsSending(true)
        setDisplayWarning(null)

        const chatHistory: ChatMessage[] = [...messages, userMessage]

        const contextLength = JSON.stringify(chatHistory).length + userMessageText.length
        
        if (contextLength > CLIENT_CONTEXT_WINDOW_SOFT_LIMIT) {
            setDisplayWarning(
                `Heads up! Your message history is getting long. You might hit the server's context limit. Consider clearing the chat. 🟠`
            )
        }

        try {
            const response = await fetch("api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: userMessageText, chatHistory: chatHistory})
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to get answer")
            }

            const data = await response.json()

            // The backend returns the full updated history, including the system message.
            // Filter out the system message for display if desired, or display it.
            // For now, setting all messages from backend directly.

            setMessages(data.updatedChatHistory)
            setCurrentCompany(data.targetCompany)

        } catch (error: any) {
            console.error("❌ Chat error:", error)
            const errorMessageText = error.message

            const errorMessage: ChatMessage = {
                id: (Date.now() + 2).toString(),
                role: "model",
                parts: [{ text: `Error: ${errorMessageText}` }],
            }

            setMessages((prevMessages) => [...prevMessages, errorMessage])
            setDisplayWarning(`Server Error: ${errorMessageText} 🚨`)
        } finally {
            setIsSending(false)
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-[500px]">
            <h2 className="text-2xl font-semibold text-black mb-4">Chat with AI Assistant 🤖</h2>

            {/* Chat History Display */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md p-4 space-y-4 mb-4">
                {messages.length === 0 && !isSending && (
                    <p className="text-gray-500 text-center">Start a conversation by typing a message below.</p>
                )}

                {messages.map((msg) => {
                    // optionally skip rendering 'system' role messages 
                    if (msg.role === 'system') return null;

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
                                    <span key={partIndex}>{part.text}</span>
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
