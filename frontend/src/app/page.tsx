"use client";

import { useState } from "react";
import axios from "axios";
import { Send, Bot, User, FileText } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Halo! Saya AI HR Assistant. Ada yang bisa saya bantu terkait SOP, kebijakan cuti, atau asuransi perusahaan?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // Hit ke endpoint FastAPI (URL diset di environment variables Vercel saat live)
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/chat/";
      const response = await axios.post(apiUrl, {
        question: userMessage,
        user_id: 1,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: response.data.answer,
          sources: response.data.source_documents,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Maaf, terjadi kesalahan pada server saat memproses permintaan Anda.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">
            Enterprise HR Assistant
          </h1>
        </div>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          System Online
        </span>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-4xl mx-auto ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-gray-800"}`}
            >
              {msg.role === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border text-gray-800 rounded-tl-none"}`}
            >
              <p className="leading-relaxed">{msg.content}</p>

              {/* Citation / Source Documents (Hanya tampil jika AI punya sumber) */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                    <FileText className="w-3 h-3" /> Sumber Dokumen:
                  </p>
                  <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded italic line-clamp-2">
                    "{msg.sources[0]}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="p-4 rounded-2xl bg-white border text-gray-500 rounded-tl-none animate-pulse">
              Sedang mencari di dokumen SOP...
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t p-4">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan kebijakan asuransi, jatah cuti, dll..."
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
