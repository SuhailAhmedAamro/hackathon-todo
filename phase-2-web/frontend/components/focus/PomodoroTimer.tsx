/**
 * PomodoroTimer Component
 * Premium timer display with circular progress
 */

"use client";

import { TimerMode, TimerStatus } from "@/lib/usePomodoro";

interface PomodoroTimerProps {
  mode: TimerMode;
  status: TimerStatus;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  progress: number;
}

export default function PomodoroTimer({
  mode,
  status,
  timeLeft,
  formatTime,
  progress,
}: PomodoroTimerProps) {
  const getModeConfig = (timerMode: TimerMode) => {
    switch (timerMode) {
      case "work":
        return {
          label: "Focus Time",
          color: "text-blue-600 dark:text-blue-400",
          gradient: "from-blue-600 to-purple-600",
          strokeColor: "#3b82f6",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
        };
      case "shortBreak":
        return {
          label: "Short Break",
          color: "text-green-600 dark:text-green-400",
          gradient: "from-green-600 to-emerald-600",
          strokeColor: "#10b981",
          bgColor: "bg-green-50 dark:bg-green-900/20",
        };
      case "longBreak":
        return {
          label: "Long Break",
          color: "text-purple-600 dark:text-purple-400",
          gradient: "from-purple-600 to-pink-600",
          strokeColor: "#9333ea",
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
        };
    }
  };

  const config = getModeConfig(mode);

  // SVG circle calculations
  const size = 320;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Mode Label */}
      <div className={`mb-8 px-6 py-3 rounded-full ${config.bgColor} animate-fadeIn`}>
        <p className={`text-lg font-semibold ${config.color}`}>{config.label}</p>
      </div>

      {/* Circular Timer */}
      <div className="relative animate-scaleIn">
        {/* Background Circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={config.strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 8px ${config.strokeColor}40)`,
            }}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-7xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {formatTime(timeLeft)}
          </div>

          {/* Status Indicator */}
          {status === "running" && (
            <div className="mt-4 flex items-center gap-2 animate-pulse">
              <div className={`w-2 h-2 rounded-full ${config.color.replace("text-", "bg-")}`} />
              <span className={`text-sm font-medium ${config.color}`}>In Progress</span>
            </div>
          )}

          {status === "paused" && (
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Paused
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Session Progress Dots */}
      <div className="mt-8 flex items-center gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < Math.floor(progress / 25)
                ? `${config.color.replace("text-", "bg-")} scale-110`
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
