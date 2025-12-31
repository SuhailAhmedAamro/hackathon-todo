/**
 * SettingsPanel Component
 * Pomodoro settings configuration
 */

"use client";

import { useState } from "react";
import { PomodoroSettings } from "@/lib/usePomodoro";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface SettingsPanelProps {
  settings: PomodoroSettings;
  onUpdate: (settings: Partial<PomodoroSettings>) => void;
  onClose: () => void;
}

export default function SettingsPanel({ settings, onUpdate, onClose }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdate(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card variant="elevated" className="max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Timer Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Work Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Focus Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.workDuration}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, workDuration: parseInt(e.target.value) || 25 })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Short Break */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={localSettings.shortBreakDuration}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  shortBreakDuration: parseInt(e.target.value) || 5,
                })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Long Break */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Long Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.longBreakDuration}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  longBreakDuration: parseInt(e.target.value) || 15,
                })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sessions Until Long Break */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sessions Until Long Break
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={localSettings.sessionsUntilLongBreak}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  sessionsUntilLongBreak: parseInt(e.target.value) || 4,
                })
              }
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Auto-start Options */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.autoStartBreaks}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoStartBreaks: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Auto-start breaks
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.autoStartWork}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoStartWork: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Auto-start focus sessions
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
