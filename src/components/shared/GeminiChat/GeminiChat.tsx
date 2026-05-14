"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAxiosPublic from "@/hooks/useAxiosPublic";

/**
 * GeminiChat Component
 * An AI-powered chat assistant that provides real-time travel advice.
 */
const GeminiChat = () => {
  const axiosPublic = useAxiosPublic();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to AuraTrip! 🌍 I'm your personal expedition guide. How can I assist you with your travel plans today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // API call to Gemini chat endpoint via backend proxy
      const response = await axiosPublic.post("/api/gemini/chat", {
        message: currentInput,
        history: messages.slice(-6), // Send last 6 messages for context
        user: {
          name: user?.displayName || "Explorer",
          email: user?.email,
        },
      });

      if (response.data && response.data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.reply },
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm currently navigating through some turbulence. Please try again in a moment! ✈️",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 md:bottom-28 md:right-8 z-[100] font-sans">
      {/* Chat Window */}
      <div
        className={`absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-[380px] h-[70vh] sm:h-[550px] max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-15rem)] 
          bg-base-100/80 backdrop-blur-3xl border border-base-content/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] 
          rounded-[2rem] sm:rounded-[2.5rem] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right
          ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10 pointer-events-none"}`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-primary to-secondary text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl flex items-center justify-center border border-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest leading-none">
                  Aura AI
                </h3>
                <p className="text-[10px] font-bold opacity-70 mt-1">
                  Online | Expedition Expert
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-base-100/40"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl text-sm font-medium leading-relaxed
                  ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20"
                      : "bg-base-200 text-base-content rounded-tl-none border border-base-content/5"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-base-200 p-4 rounded-2xl rounded-tl-none border border-base-content/5 flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSend}
          className="p-4 sm:p-6 pt-2 bg-base-100/40 shrink-0"
        >
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your trip..."
              disabled={isLoading}
              className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-base-200 border border-base-content/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-primary/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-[10px] text-center font-bold text-base-content/30 uppercase tracking-widest">
            Powered by Aura AI Engine
          </p>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 border border-white/10
          ${isOpen ? "bg-error text-white rotate-90 scale-90" : "bg-secondary text-white hover:-translate-y-2 hover:scale-105"}`}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}

        {/* Unread Indicator */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default GeminiChat;
