/**
 * CompleteNavbar Component
 * Full navigation with all menu items and user profile
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Task } from "@/lib/types";
import { api } from "@/lib/api";
import { useTheme } from "@/lib/theme";
import SearchBar from "./ui/SearchBar";
import IconButton from "./ui/IconButton";
import Badge from "./ui/Badge";

interface CompleteNavbarProps {
  user: User;
  onLogout: () => void;
}

export default function CompleteNavbar({ user, onLogout }: CompleteNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load profile picture from localStorage
  useEffect(() => {
    const savedPic = localStorage.getItem(`profile_pic_${user.id}`);
    if (savedPic) {
      setProfilePic(savedPic);
    }

    // Listen for storage changes to update profile pic in real-time
    const handleStorageChange = () => {
      const updatedPic = localStorage.getItem(`profile_pic_${user.id}`);
      setProfilePic(updatedPic);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user.id]);

  // Cycle through themes
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Tasks", href: "/tasks" },
    { name: "Upcoming", href: "/upcoming" },
    { name: "Categories", href: "/tags" },
    { name: "Focus", href: "/focus" },
    { name: "Analytics", href: "/analytics" },
    { name: "Streaks", href: "/streaks" },
  ];

  // Load all tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setSearchLoading(true);
        const response = await api.getTasks();
        setAllTasks(response.items);
      } catch (error) {
        console.error("Failed to load tasks for search:", error);
      } finally {
        setSearchLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Filter tasks by title or description
    const filtered = allTasks.filter((task) => {
      const searchLower = query.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    });

    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  // Handle clicking on a search result
  const handleResultClick = (taskId: string) => {
    setShowSearchResults(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/tasks#${taskId}`);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu")) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b-2 border-blue-500 dark:border-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4 relative" ref={searchRef}>
            <SearchBar onSearch={handleSearch} />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No tasks found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
                    </div>
                    {searchResults.slice(0, 10).map((task) => (
                      <button
                        key={task.id}
                        onClick={() => handleResultClick(task.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge
                                variant={
                                  task.status === "completed"
                                    ? "success"
                                    : task.status === "in_progress"
                                    ? "info"
                                    : "default"
                                }
                                size="sm"
                              >
                                {task.status === "completed"
                                  ? "Done"
                                  : task.status === "in_progress"
                                  ? "In Progress"
                                  : "Pending"}
                              </Badge>
                              {task.priority && (
                                <Badge
                                  variant={
                                    task.priority === "high"
                                      ? "error"
                                      : task.priority === "medium"
                                      ? "warning"
                                      : "success"
                                  }
                                  size="sm"
                                >
                                  {task.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                    {searchResults.length > 10 && (
                      <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 mt-2">
                        Showing first 10 of {searchResults.length} results
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side: User Menu */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
              title={`Current theme: ${theme}`}
            >
              {theme === "light" ? (
                <svg className="w-5 h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : theme === "dark" ? (
                <svg className="w-5 h-5 text-blue-400 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* User Dropdown */}
            <div className="relative user-menu">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover shadow-md ring-2 ring-blue-500 dark:ring-blue-400"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 animate-scaleIn">
                  {/* User Info Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-blue-500 dark:ring-blue-400"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {user.is_active && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Active
                      </span>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Your Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/settings");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
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
                      <span className="text-sm font-medium">Settings</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* Mobile Search */}
            <div className="mt-4 md:hidden relative">
              <SearchBar onSearch={handleSearch} />

              {/* Mobile Search Results */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                  {searchLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No tasks found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
                      </div>
                      {searchResults.slice(0, 10).map((task) => (
                        <button
                          key={task.id}
                          onClick={() => {
                            handleResultClick(task.id);
                            setShowMobileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1.5">
                                <Badge
                                  variant={
                                    task.status === "completed"
                                      ? "success"
                                      : task.status === "in_progress"
                                      ? "info"
                                      : "default"
                                  }
                                  size="sm"
                                >
                                  {task.status === "completed"
                                    ? "Done"
                                    : task.status === "in_progress"
                                    ? "In Progress"
                                    : "Pending"}
                                </Badge>
                                {task.priority && (
                                  <Badge
                                    variant={
                                      task.priority === "high"
                                        ? "error"
                                        : task.priority === "medium"
                                        ? "warning"
                                        : "success"
                                    }
                                    size="sm"
                                  >
                                    {task.priority}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      ))}
                      {searchResults.length > 10 && (
                        <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 mt-2">
                          Showing first 10 of {searchResults.length} results
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
