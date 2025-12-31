"use client";

/**
 * Focus Mode Page
 * Premium Pomodoro timer for deep focus sessions
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { usePomodoro } from "@/lib/usePomodoro";
import { FullPageLoading } from "@/components/ui/Loading";
import CompleteNavbar from "@/components/CompleteNavbar";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import IconButton from "@/components/ui/IconButton";
import PomodoroTimer from "@/components/focus/PomodoroTimer";
import TimerControls from "@/components/focus/TimerControls";
import SessionStats from "@/components/focus/SessionStats";
import SettingsPanel from "@/components/focus/SettingsPanel";
import toast from "react-hot-toast";

export default function FocusPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const pomodoro = usePomodoro();

  // Sound notifications
  useEffect(() => {
    if (soundEnabled && pomodoro.timeLeft === 0 && pomodoro.status === "idle") {
      // Play sound when timer completes
      playNotificationSound();

      // Show toast notification
      if (pomodoro.mode === "work") {
        toast.success("🎉 Focus session completed! Time for a break.", {
          duration: 5000,
        });
      } else {
        toast.success("✨ Break complete! Ready to focus again?", {
          duration: 5000,
        });
      }
    }
  }, [pomodoro.timeLeft, pomodoro.status, pomodoro.mode, soundEnabled]);

  // Browser notification
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Send browser notification
  useEffect(() => {
    if (
      pomodoro.timeLeft === 0 &&
      pomodoro.status === "idle" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      const title = pomodoro.mode === "work"
        ? "Focus Session Complete!"
        : "Break Time Over!";
      const body = pomodoro.mode === "work"
        ? "Great job! Time to take a break."
        : "Ready to get back to work?";

      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  }, [pomodoro.timeLeft, pomodoro.status, pomodoro.mode]);

  // Play notification sound
  const playNotificationSound = () => {
    // Use Web Audio API to generate a pleasant notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/focus");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <FullPageLoading message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <CompleteNavbar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Focus Mode
                  </h1>
                  <Badge variant="purple" dot>
                    New
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Use the Pomodoro Technique to boost your productivity
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                {/* Sound Toggle */}
                <IconButton
                  icon={
                    soundEnabled ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                        />
                      </svg>
                    )
                  }
                  variant="ghost"
                  ariaLabel={soundEnabled ? "Mute sounds" : "Enable sounds"}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={soundEnabled ? "text-blue-600" : "text-gray-400"}
                />

                {/* Settings */}
                <IconButton
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  }
                  variant="default"
                  ariaLabel="Open settings"
                  onClick={() => setShowSettings(true)}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-5xl mx-auto mb-8">
            <SessionStats stats={pomodoro.stats} sessionCount={pomodoro.sessionCount} />
          </div>

          {/* Timer Section */}
          <div className="max-w-5xl mx-auto">
            <Card variant="elevated" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="py-8">
                {/* Timer Display */}
                <PomodoroTimer
                  mode={pomodoro.mode}
                  status={pomodoro.status}
                  timeLeft={pomodoro.timeLeft}
                  formatTime={pomodoro.formatTime}
                  progress={pomodoro.progress()}
                />

                {/* Controls */}
                <div className="mt-12">
                  <TimerControls
                    status={pomodoro.status}
                    mode={pomodoro.mode}
                    onStart={pomodoro.start}
                    onPause={pomodoro.pause}
                    onResume={pomodoro.resume}
                    onReset={pomodoro.reset}
                    onSkip={pomodoro.skip}
                    onSwitchMode={pomodoro.switchMode}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Tips Card */}
          <div className="max-w-5xl mx-auto mt-8">
            <Card variant="gradient" className="animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    How to use Focus Mode
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Work in focused 25-minute intervals with short breaks in between</li>
                    <li>• After 4 focus sessions, take a longer 15-minute break</li>
                    <li>• Eliminate distractions and commit fully during focus time</li>
                    <li>• Use breaks to rest, stretch, and recharge for the next session</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </main>

      <Footer />

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel
          settings={pomodoro.settings}
          onUpdate={pomodoro.updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
