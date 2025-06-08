// components/Header.jsx
"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Header({
  boardName,
  onAddNewTask,
  onEditBoard,
  onDeleteBoard,
}) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Grab theme info from next-themes
  const { theme, setTheme, systemTheme } = useTheme();

  // Prevent hydration mismatch: only show toggle once mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine actual current theme (could be “system”)
  const currentTheme = theme === "system" ? systemTheme : theme;

  const handleThemeToggle = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const handleEdit = () => {
    onEditBoard();
    setMenuOpen(false);
  };

  const handleDelete = () => {
    onDeleteBoard();
    setMenuOpen(false);
  };

  return (
    <header className="bg-[#2B2C37] p-4 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{boardName}</h1>

        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-full hover:bg-gray-600 transition"
              aria-label="Toggle Theme"
            >
              {currentTheme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-200" />
              )}
            </button>
          )}

          {/* Add New Task */}
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-full font-semibold flex items-center space-x-2"
            onClick={onAddNewTask}
            disabled={!boardName}
          >
            <span>+ Add New Task</span>
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-400 hover:text-white"
            >
              <MoreVertical />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#20212c] rounded-lg shadow-lg z-20">
                <button
                  onClick={handleEdit}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Edit Board
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  Delete Board
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
