"use client";

/**
 * ConversationList Component
 * Displays list of past conversations
 */

import { Conversation } from "../types";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationListProps) {
  return (
    <div className="w-64 border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
      {/* New conversation button */}
      <button
        onClick={onNewConversation}
        className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition-colors duration-200"
      >
        + New Conversation
      </button>

      {/* Conversations list */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Recent Conversations
        </h3>

        {conversations.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No conversations yet
          </p>
        )}

        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              conversation.id === activeConversationId
                ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {conversation.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {conversation.message_count} messages
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(conversation.updated_at).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
