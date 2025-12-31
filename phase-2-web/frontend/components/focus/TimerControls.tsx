/**
 * TimerControls Component
 * Control buttons for Pomodoro timer
 */

"use client";

import { TimerStatus, TimerMode } from "@/lib/usePomodoro";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

interface TimerControlsProps {
  status: TimerStatus;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
  onSwitchMode: (mode: TimerMode) => void;
}

export default function TimerControls({
  status,
  mode,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
  onSwitchMode,
}: TimerControlsProps) {
  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Reset */}
        {status !== "idle" && (
          <IconButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            }
            variant="ghost"
            size="lg"
            ariaLabel="Reset timer"
            onClick={onReset}
          />
        )}

        {/* Start/Pause/Resume */}
        {status === "idle" && (
          <Button
            variant="primary"
            size="lg"
            onClick={onStart}
            className="min-w-[160px]"
            leftIcon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          >
            Start
          </Button>
        )}

        {status === "running" && (
          <Button
            variant="secondary"
            size="lg"
            onClick={onPause}
            className="min-w-[160px]"
            leftIcon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          >
            Pause
          </Button>
        )}

        {status === "paused" && (
          <Button
            variant="primary"
            size="lg"
            onClick={onResume}
            className="min-w-[160px]"
            leftIcon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          >
            Resume
          </Button>
        )}

        {/* Skip */}
        <IconButton
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          }
          variant="ghost"
          size="lg"
          ariaLabel="Skip to next session"
          onClick={onSkip}
        />
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onSwitchMode("work")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === "work"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => onSwitchMode("shortBreak")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === "shortBreak"
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => onSwitchMode("longBreak")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === "longBreak"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Long Break
        </button>
      </div>
    </div>
  );
}
