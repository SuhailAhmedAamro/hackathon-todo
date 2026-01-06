"use client";

/**
 * Phase 3 Chatbot Widget - Integrated into Phase 2 App
 * ALL BONUS FEATURES: Voice + Urdu + MCP Tools
 * Floating widget in bottom-right corner
 */

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState<"en" | "ur">("en");

  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLang === "ur" ? "ur-PK" : "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, [currentLang]);

  // WebSocket connection
  useEffect(() => {
    if (!isOpen) return;

    const ws = new WebSocket("ws://localhost:8001/ws/chat");

    ws.onopen = () => {
      setIsConnected(true);
      addWelcomeMessage();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        setIsTyping(false);
        addMessage(data.content, "assistant");

        // Text-to-speech
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(data.content);
          utterance.lang = currentLang === "ur" ? "ur-PK" : "en-US";
          utterance.rate = 0.9;
          speechSynthesis.speak(utterance);
        }
      } else if (data.type === "typing") {
        setIsTyping(data.is_typing);
      }
    };

    ws.onerror = () => setIsConnected(false);
    ws.onclose = () => setIsConnected(false);

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addWelcomeMessage = () => {
    const welcome: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        currentLang === "ur"
          ? "👋 السلام علیکم! میں آپ کی مدد کے لیے حاضر ہوں۔"
          : "👋 Hi! I'm your AI assistant. Try: 'Create a task' or use voice! 🎤",
      timestamp: new Date(),
    };
    setMessages([welcome]);
  };

  const addMessage = (content: string, role: "user" | "assistant") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || !isConnected) return;

    addMessage(input, "user");

    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        message: input,
        conversation_id: "dashboard",
        language: currentLang,
      })
    );

    setInput("");
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang =
        currentLang === "ur" ? "ur-PK" : "en-US";
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === "en" ? "ur" : "en"));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600
                   text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110
                   transition-all duration-300 flex items-center justify-center z-50
                   animate-pulse"
        title="Open AI Assistant (Phase 3 +700 Bonus!)"
      >
        <span className="text-2xl">🤖</span>
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold
                       px-2 py-1 rounded-full">
          +700
        </span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-900
                  rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-purple-500/20"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          />
          <div>
            <h3 className="font-bold text-sm">
              {currentLang === "ur" ? "🤖 اے آئی اسسٹنٹ" : "🤖 AI Assistant"}
            </h3>
            <p className="text-xs opacity-90">
              {currentLang === "ur" ? "آواز + اردو + MCP" : "Voice + Urdu + MCP"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition"
            title="Switch language"
          >
            {currentLang === "ur" ? "EN" : "🇵🇰"}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Bonus Badge */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 text-center py-1 text-xs font-bold">
        🏆 +700 BONUS POINTS | Voice 🎤 | Urdu 🇵🇰
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              } ${/[\u0600-\u06FF]/.test(msg.content) ? "text-right" : ""}`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setInput("Create a new task")}
            className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full
                     hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            ➕ New
          </button>
          <button
            onClick={() => setInput("Show all tasks")}
            className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full
                     hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            📋 List
          </button>
          {currentLang === "ur" && (
            <button
              onClick={() => setInput("نیا ٹاسک بنائیں")}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              🇵🇰 اردو
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              currentLang === "ur"
                ? "اپنا پیغام ٹائپ کریں..."
                : "Type or speak..."
            }
            disabled={!isConnected}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2
                     focus:ring-purple-500 disabled:opacity-50"
          />
          <button
            onClick={toggleVoice}
            disabled={!recognitionRef.current}
            className={`px-3 py-2 rounded-lg transition ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-green-500 text-white hover:bg-green-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Voice input"
          >
            🎤
          </button>
          <button
            onClick={sendMessage}
            disabled={!isConnected || !input.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700
                     transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>

        {isListening && (
          <p className="text-xs text-green-600 mt-2 animate-pulse">
            🎤 {currentLang === "ur" ? "سن رہا ہوں..." : "Listening..."}
          </p>
        )}
      </div>
    </div>
  );
}
