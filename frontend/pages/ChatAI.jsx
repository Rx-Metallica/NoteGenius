import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import Navbar from "../src/components/Navbar";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, message: input }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to get response");

      const assistantMessage = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Failed to get response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-white">
      <Navbar />

      {/* Header */}
      <header className="text-center mt-12 mb-6">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
          Chat with Your Notes
        </h1>
        <p className="text-gray-500 mt-2">
          Ask questions about your notes and get intelligent responses.
        </p>
      </header>

      {/* Chat Container */}
      <div className="flex flex-col mx-auto w-full max-w-3xl bg-white shadow-xl rounded-2xl p-4 h-[70vh] overflow-hidden mb-16 border border-purple-100">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center text-center mt-16 space-y-4 text-gray-600">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white w-fit">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold">Start a Conversation</h2>
              <p className="text-gray-500 max-w-sm">
                Ask me anything about your notes! I can help you find information,
                summarize content, or answer questions based on your notes.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start mt-2">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl flex items-center gap-2 text-gray-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="mt-2 border-t border-gray-200 pt-3 flex gap-2 bg-white">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            placeholder="Ask about your notes..."
            className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-indigo-600 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;
