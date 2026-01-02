"""
Urdu Translation Support
Provides bilingual support for Urdu and English
"""

from typing import Dict, Tuple
import re

# Urdu command mappings (Roman Urdu + Urdu script)
URDU_COMMANDS = {
    # Task creation commands
    "task banao": "create task",
    "kaam banao": "create task",
    "naya task": "new task",
    "task shamil karo": "add task",
    "ٹاسک بنائیں": "create task",
    "کام بنائیں": "create task",
    "نیا ٹاسک": "new task",

    # List commands
    "sare tasks dikhao": "show all tasks",
    "mere tasks": "my tasks",
    "task list": "task list",
    "pending tasks": "pending tasks",
    "تمام ٹاسک دکھائیں": "show all tasks",
    "میرے ٹاسک": "my tasks",

    # Update commands
    "task complete karo": "complete task",
    "kaam complete": "complete task",
    "task khatam": "finish task",
    "ٹاسک مکمل کریں": "complete task",
    "کام ختم": "finish task",

    # Priority
    "high priority": "high priority",
    "zaroori": "high priority",
    "ضروری": "high priority",
    "medium priority": "medium priority",
    "low priority": "low priority",

    # Delete commands
    "task delete karo": "delete task",
    "khatam karo": "delete task",
    "ٹاسک ڈیلیٹ کریں": "delete task",

    # Search
    "dhundo": "search",
    "khojo": "search",
    "ڈھونڈیں": "search",
}

# Response translations (English to Urdu)
RESPONSE_TRANSLATIONS = {
    "Task created successfully": "ٹاسک کامیابی سے بنایا گیا ✅",
    "Here are your tasks": "یہ آپ کے ٹاسک ہیں 📋",
    "Task completed": "ٹاسک مکمل ہو گیا ✅",
    "Task deleted": "ٹاسک ڈیلیٹ کر دیا گیا 🗑️",
    "No tasks found": "کوئی ٹاسک نہیں ملا",
    "High priority": "اہم ضروری",
    "Medium priority": "درمیانی",
    "Low priority": "کم اہمیت",
    "Pending": "زیر التوا",
    "Completed": "مکمل",
}


class UrduTranslator:
    """Handles Urdu to English and English to Urdu translations"""

    def __init__(self):
        self.urdu_commands = URDU_COMMANDS
        self.response_translations = RESPONSE_TRANSLATIONS

    def detect_language(self, text: str) -> str:
        """
        Detect if text is in Urdu or English

        Returns:
            'ur' for Urdu, 'en' for English
        """
        # Check for Urdu characters (Unicode range for Urdu)
        urdu_pattern = r'[\u0600-\u06FF]'

        if re.search(urdu_pattern, text):
            return 'ur'

        # Check for Roman Urdu keywords
        text_lower = text.lower()
        for urdu_cmd in self.urdu_commands.keys():
            if urdu_cmd in text_lower and not urdu_cmd.startswith('ٹ'):
                return 'ur'

        return 'en'

    def translate_to_english(self, urdu_text: str) -> Tuple[str, str]:
        """
        Translate Urdu command to English

        Args:
            urdu_text: User input in Urdu

        Returns:
            Tuple of (translated_text, detected_language)
        """
        lang = self.detect_language(urdu_text)

        if lang == 'en':
            return urdu_text, 'en'

        # Translate command
        text_lower = urdu_text.lower()
        translated = urdu_text

        for urdu_cmd, eng_cmd in self.urdu_commands.items():
            if urdu_cmd in text_lower:
                translated = text_lower.replace(urdu_cmd, eng_cmd)
                break

        return translated, 'ur'

    def translate_to_urdu(self, english_text: str) -> str:
        """
        Translate English response to Urdu

        Args:
            english_text: Response in English

        Returns:
            Translated Urdu text
        """
        # Replace known phrases
        translated = english_text

        for eng_phrase, urdu_phrase in self.response_translations.items():
            if eng_phrase.lower() in translated.lower():
                translated = translated.replace(eng_phrase, urdu_phrase)

        return translated

    def get_bilingual_response(self, english_response: str, original_language: str) -> str:
        """
        Get response in appropriate language

        Args:
            english_response: Response in English
            original_language: Original user input language

        Returns:
            Response in appropriate language
        """
        if original_language == 'ur':
            urdu_response = self.translate_to_urdu(english_response)
            # Return both for better UX
            return f"{urdu_response}\n\n{english_response}"

        return english_response

    def get_example_commands(self, language: str = 'en') -> list:
        """
        Get example commands in specified language

        Args:
            language: 'en' or 'ur'

        Returns:
            List of example commands
        """
        if language == 'ur':
            return [
                "نیا ٹاسک بنائیں: کوڈ کی جانچ کریں",
                "تمام ٹاسک دکھائیں",
                "ضروری ٹاسک کیا ہیں؟",
                "ٹاسک مکمل کریں",
                "task banao: Hackathon submit karo",
                "mere sare pending tasks dikhao",
            ]
        else:
            return [
                "Create a new task: Review code",
                "Show all my tasks",
                "What are my high priority tasks?",
                "Mark task as complete",
                "Search for tasks about testing",
            ]


# Global translator instance
translator = UrduTranslator()
