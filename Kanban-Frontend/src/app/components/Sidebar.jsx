// components/Sidebar.jsx
"use client";
import { useState } from "react";
import { Sun, Moon, Plus, LayoutGrid, EyeOff } from "lucide-react";

export default function Sidebar({ boards, activeBoard, setActiveBoard, onAddNewBoard }) {
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  if (isSidebarHidden) {
    return (
       <button 
         onClick={() => setIsSidebarHidden(false)}
         className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-r-full fixed bottom-8 left-0 z-20"
       >
         <EyeOff className="w-6 h-6 transform -scale-x-100" />
       </button>
    );
  }

  return (
    <aside className="w-72 bg-[#2B2C37] text-white h-screen flex flex-col justify-between p-4">
      <div>
        <div className="text-3xl font-bold flex items-center space-x-2 mb-10 pl-2">
           kanban
        </div>

        <div className="text-gray-400 text-sm tracking-wider mb-4 pl-2">
          ALL BOARDS ({boards.length})
        </div>

        <div className="space-y-1">
          {boards.map((board) => (
            <button
              key={board}
              onClick={() => setActiveBoard(board)}
              className={`flex items-center w-full text-left px-4 py-3 rounded-r-full transition ${
                activeBoard === board
                  ? "bg-indigo-500 text-white font-semibold"
                  : "text-gray-400 hover:bg-indigo-500/50 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4 mr-3" />
              {board}
            </button>
          ))}
        </div>

        <button 
          onClick={onAddNewBoard}
          className="flex items-center w-full mt-2 text-indigo-400 hover:text-indigo-300 px-4 py-3"
        >
          <LayoutGrid className="w-4 h-4 mr-3" />
          + Create New Board
        </button>
      </div>

      <div>
        <div className="bg-[#20212c] p-3 rounded-md flex items-center justify-center space-x-6 mt-6">
          <Sun className="text-gray-400 w-5 h-5" />
          <button
            className="bg-indigo-500 rounded-full w-10 h-5 flex items-center px-1"
            onClick={() => setDarkMode(!darkMode)}
          >
            <div
              className={`bg-white w-3.5 h-3.5 rounded-full transition-transform ${
                darkMode ? "translate-x-5" : ""
              }`}
            />
          </button>
          <Moon className="text-gray-400 w-5 h-5" />
        </div>

        <button 
          onClick={() => setIsSidebarHidden(true)}
          className="flex items-center text-sm text-gray-500 hover:text-white mt-4 ml-2"
        >
           <EyeOff className="w-4 h-4 mr-2" />
           Hide Sidebar
        </button>
      </div>
    </aside>
  );
}