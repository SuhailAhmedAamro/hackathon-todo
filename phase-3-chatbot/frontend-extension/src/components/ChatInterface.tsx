"use client";

/**
 * ChatInterface Component
 * Main container for the chatbot interface
 */

import { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Message } from "../types";

interface ChatInterfaceProps {
  conversationId?: string;
  onClose?: () => void;
}

export default function ChatInterface({
  conversationId,
  onClose,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection
  useEffect(() => {
    // Connect to MCP server WebSocket
    const ws = new WebSocket("ws://localhost:8001/ws/chat");

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      if (data.type === "message") {
        // Add assistant message
        const newMessage: Message = {
          id: Date.now().toString(),
          role: data.role,
          content: data.content,
          tool_calls: data.tool_calls,
          timestamp: new Date(data.timestamp),
        };
        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(false);
      } else if (data.type === "typing") {
        setIsTyping(data.is_typing);
      } else if (data.type === "tool_result") {
        console.log("Tool result:", data.result);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    wsRef.current = ws;

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (!wsRef.current || !isConnected) {
      console.error("WebSocket not connected");
      return;
    }

    // Add user message to UI
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to server
    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        message: content,
        conversation_id: conversationId || "demo",
      })
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h2>
          <span className="text-xs text-gray-500">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <MessageList messages={messages} isTyping={isTyping} />

      {/* Input */}
      <MessageInput onSend={handleSendMessage} disabled={!isConnected} />
    </div>
  );
}
