"""
Unified AI Provider
Supports multiple AI backends: Groq (FREE), Claude, OpenAI, Mock
"""

import os
from typing import List, Dict, Any, Optional
import logging
from enum import Enum

logger = logging.getLogger(__name__)


class AIProvider(Enum):
    """Available AI providers"""
    GROQ = "groq"           # FREE - Recommended
    CLAUDE = "claude"       # Paid - Best quality
    OPENAI = "openai"       # Paid
    GEMINI = "gemini"       # Free tier available
    MOCK = "mock"           # Fallback - No API needed


class UnifiedAIClient:
    """
    Unified AI Client that supports multiple providers

    Priority order (if no provider specified):
    1. Groq (if GROQ_API_KEY is set) - FREE
    2. Claude (if ANTHROPIC_API_KEY is set)
    3. OpenAI (if OPENAI_API_KEY is set)
    4. Mock (fallback)
    """

    def __init__(self, provider: Optional[str] = None):
        """
        Initialize unified AI client

        Args:
            provider: Specific provider to use ('groq', 'claude', 'openai', 'mock')
                     If not specified, auto-detects based on available API keys
        """
        self.provider = self._detect_provider(provider)
        self.client = self._initialize_client()
        logger.info(f"Initialized AI provider: {self.provider.value}")

    def _detect_provider(self, provider: Optional[str]) -> AIProvider:
        """Detect which provider to use based on env vars or preference"""

        # If specific provider requested
        if provider:
            provider = provider.lower()
            if provider == "groq":
                return AIProvider.GROQ
            elif provider == "claude":
                return AIProvider.CLAUDE
            elif provider == "openai":
                return AIProvider.OPENAI
            elif provider == "gemini":
                return AIProvider.GEMINI
            elif provider == "mock":
                return AIProvider.MOCK

        # Auto-detect based on available API keys
        # Prioritize Groq since it's free
        if os.getenv("GROQ_API_KEY"):
            logger.info("Found GROQ_API_KEY - using Groq (FREE)")
            return AIProvider.GROQ

        if os.getenv("ANTHROPIC_API_KEY"):
            logger.info("Found ANTHROPIC_API_KEY - using Claude")
            return AIProvider.CLAUDE

        if os.getenv("OPENAI_API_KEY"):
            logger.info("Found OPENAI_API_KEY - using OpenAI")
            return AIProvider.OPENAI

        if os.getenv("GOOGLE_API_KEY"):
            logger.info("Found GOOGLE_API_KEY - using Gemini")
            return AIProvider.GEMINI

        # Fallback to mock
        logger.warning("No API keys found - using Mock AI (limited functionality)")
        logger.warning("Get a FREE Groq API key at: https://console.groq.com")
        return AIProvider.MOCK

    def _initialize_client(self):
        """Initialize the appropriate AI client"""

        if self.provider == AIProvider.GROQ:
            from utils.groq_client import GroqClient
            return GroqClient()

        elif self.provider == AIProvider.CLAUDE:
            from utils.claude_client import ClaudeClient
            return ClaudeClient()

        elif self.provider == AIProvider.OPENAI:
            from utils.openai_client import OpenAIClient
            return OpenAIClient()

        elif self.provider == AIProvider.GEMINI:
            from utils.gemini_client import GeminiClient
            return GeminiClient()

        else:
            from utils.mock_ai_client import MockAIClient
            return MockAIClient()

    async def chat(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict]] = None,
        max_tokens: int = 2048
    ) -> Dict[str, Any]:
        """
        Send chat message and get response

        Args:
            messages: List of message dicts with 'role' and 'content'
            system_prompt: Optional system prompt
            tools: Optional list of tool definitions
            max_tokens: Maximum tokens in response

        Returns:
            Dict with response content and potential tool calls
        """
        return await self.client.chat(
            messages=messages,
            system_prompt=system_prompt,
            tools=tools,
            max_tokens=max_tokens
        )

    def get_system_prompt(self) -> str:
        """Get system prompt from the client"""
        return self.client.get_system_prompt()

    def get_tool_definitions(self) -> List[Dict]:
        """Get tool definitions from the client"""
        return self.client.get_tool_definitions()

    def get_provider_info(self) -> Dict[str, Any]:
        """Get information about the current provider"""
        info = {
            "provider": self.provider.value,
            "is_free": self.provider in [AIProvider.GROQ, AIProvider.MOCK, AIProvider.GEMINI],
        }

        if self.provider == AIProvider.GROQ:
            info["model"] = getattr(self.client, 'model', 'llama-3.3-70b-versatile')
            info["description"] = "Groq - Fast and FREE inference"
            info["get_key_url"] = "https://console.groq.com"
        elif self.provider == AIProvider.CLAUDE:
            info["model"] = getattr(self.client, 'model', 'claude-3-5-sonnet')
            info["description"] = "Claude - Best quality (paid)"
            info["get_key_url"] = "https://console.anthropic.com"
        elif self.provider == AIProvider.OPENAI:
            info["model"] = getattr(self.client, 'model', 'gpt-4')
            info["description"] = "OpenAI GPT-4 (paid)"
            info["get_key_url"] = "https://platform.openai.com"
        elif self.provider == AIProvider.GEMINI:
            info["model"] = getattr(self.client, 'model', 'gemini-pro')
            info["description"] = "Google Gemini (free tier available)"
            info["get_key_url"] = "https://makersuite.google.com/app/apikey"
        else:
            info["model"] = "mock"
            info["description"] = "Mock AI - Limited pattern matching (no API needed)"
            info["get_key_url"] = "https://console.groq.com"

        return info


def get_ai_client(provider: Optional[str] = None) -> UnifiedAIClient:
    """
    Factory function to get an AI client

    Args:
        provider: Optional provider name ('groq', 'claude', 'openai', 'mock')

    Returns:
        UnifiedAIClient instance
    """
    return UnifiedAIClient(provider)
