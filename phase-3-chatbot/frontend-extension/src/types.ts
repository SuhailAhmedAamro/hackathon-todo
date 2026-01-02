/**
 * Type definitions for Phase 3 Chatbot
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tool_calls?: ToolCall[];
  tool_results?: ToolResult[];
  timestamp: Date;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, any>;
}

export interface ToolResult {
  tool_call_id: string;
  success: boolean;
  data?: any;
  error?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  message_count: number;
}

export interface WebSocketMessage {
  type: "chat" | "tool_call" | "message" | "typing" | "tool_result";
  message?: string;
  conversation_id?: string;
  tool?: string;
  parameters?: Record<string, any>;
  role?: "user" | "assistant";
  content?: string;
  tool_calls?: ToolCall[];
  is_typing?: boolean;
  result?: any;
  timestamp?: string;
}
