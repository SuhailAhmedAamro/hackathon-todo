"use client";

/**
 * MessageList Component
 * Displays list of chat messages
 */

import { useEffect, useRef } from "react";
import { Message } from "../types";

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

export default function MessageList({ messages, isTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-lg font-medium">Hi! I'm your AI task assistant</p>
          <p className="text-sm mt-2">
            I can help you create, manage, and organize your tasks.
          </p>
          <div className="mt-6 text-left max-w-md mx-auto space-y-2">
            <p className="text-xs font-semibold">Try saying:</p>
            <ul className="text-xs space-y-1">
              <li>• "Create a high priority task to review code"</li>
              <li>• "Show me all my pending tasks"</li>
              <li>• "Mark the documentation task as complete"</li>
              <li>• "Search for tasks about testing"</li>
            </ul>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>

            {/* Tool calls indicator */}
            {message.tool_calls && message.tool_calls.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                <p className="text-xs opacity-75">
                  🔧 Used {message.tool_calls.length} tool(s)
                </p>
              </div>
            )}

            <p className="text-xs opacity-75 mt-1">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
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
  );
}
